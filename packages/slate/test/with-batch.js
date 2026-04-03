import assert from 'assert'
import { createEditor, Editor, Text, Transforms } from '../src'
import {
  getCommittedChildren,
  hasDraftChildren,
  hasInsertNodeDraft,
} from '../src/core/children'
import { applySetNodeBatchToChildren } from '../src/core/batching/exact-set-node-children'
import { applyInsertNodeBatchToChildren } from '../src/core/batching/same-parent-insert-node-children'
import { applyDirectTextMergeBatchToChildren } from '../src/core/batching/direct-text-merge-batch-children'
import { applyDirectTextSplitBatchToChildren } from '../src/core/batching/direct-text-split-batch-children'
import { applyTextBatchToChildren } from '../src/core/batching/text-batch-children'
import { wrapApply } from '../src/core/batch'

const flushMicrotasks = async () => {
  await new Promise(resolve => setTimeout(resolve, 0))
}

const createParagraphs = () => [
  { type: 'paragraph', children: [{ text: 'one' }] },
  { type: 'paragraph', children: [{ text: 'two' }] },
]

const createTextTaggingEditor = () => {
  const editor = createEditor()
  const { normalizeNode } = editor

  editor.normalizeNode = entry => {
    const [node, path] = entry

    if (Text.isText(node) && node.leafTag !== path.join(',')) {
      Transforms.setNodes(
        editor,
        { leafTag: path.join(',') },
        { at: path, voids: true }
      )
      return
    }

    normalizeNode(entry)
  }

  return editor
}

const deepClone = value => JSON.parse(JSON.stringify(value))

const runBatchEntry = (editor, batchEntry, ops) => {
  if (batchEntry === 'applyBatch') {
    Transforms.applyBatch(editor, deepClone(ops))
    return
  }

  Editor.withBatch(editor, () => {
    for (const op of deepClone(ops)) {
      editor.apply(op)
    }
  })
}

const assertBatchMatchesReplay = ({ children, ops, selection = null }) => {
  for (const batchEntry of ['applyBatch', 'manualWithBatch']) {
    const batchEditor = createEditor()
    const replayEditor = createEditor()

    batchEditor.children = deepClone(children)
    replayEditor.children = deepClone(children)
    batchEditor.selection = deepClone(selection)
    replayEditor.selection = deepClone(selection)

    runBatchEntry(batchEditor, batchEntry, ops)

    for (const op of deepClone(ops)) {
      replayEditor.apply(op)
    }

    assert.deepEqual(
      batchEditor.children,
      replayEditor.children,
      `children diverged for batchEntry=${batchEntry}`
    )
    assert.deepEqual(
      batchEditor.selection,
      replayEditor.selection,
      `selection diverged for batchEntry=${batchEntry}`
    )
  }
}

describe('Editor.withBatch', () => {
  it('defers normalization and flush until the outer batch boundary', async () => {
    const editor = createEditor()
    const normalizedPaths = []
    const onChangeCalls = []

    editor.children = createParagraphs()

    const { normalizeNode } = editor
    editor.normalizeNode = entry => {
      normalizedPaths.push(entry[1].join(','))
      normalizeNode(entry)
    }
    editor.onChange = options => {
      onChangeCalls.push({
        operation: options?.operation,
        operations: JSON.parse(JSON.stringify(editor.operations)),
      })
    }

    Editor.withBatch(editor, () => {
      Transforms.setNodes(editor, { id: 'a' }, { at: [0] })
      Transforms.setNodes(editor, { id: 'b' }, { at: [1] })

      assert.deepEqual(normalizedPaths, [])
      assert.equal(onChangeCalls.length, 0)
      assert.deepEqual(editor.operations, [
        {
          type: 'set_node',
          path: [0],
          properties: {},
          newProperties: { id: 'a' },
        },
        {
          type: 'set_node',
          path: [1],
          properties: {},
          newProperties: { id: 'b' },
        },
      ])
    })

    assert.notEqual(normalizedPaths.length, 0)
    assert.equal(onChangeCalls.length, 0)

    await flushMicrotasks()

    assert.equal(onChangeCalls.length, 1)
    assert.deepEqual(onChangeCalls[0].operation, undefined)
    assert.deepEqual(onChangeCalls[0].operations, [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'b' },
      },
    ])
    assert.deepEqual(editor.operations, [])
  })

  it('flushes only once for nested batches', async () => {
    const editor = createEditor()
    let onChangeCount = 0

    editor.children = createParagraphs()
    editor.onChange = () => {
      onChangeCount++
    }

    Editor.withBatch(editor, () => {
      Editor.withBatch(editor, () => {
        Transforms.setNodes(editor, { id: 'a' }, { at: [0] })
      })

      assert.equal(onChangeCount, 0)
    })

    assert.equal(onChangeCount, 0)

    await flushMicrotasks()

    assert.equal(onChangeCount, 1)
  })

  it('defers mark-only flushes too', async () => {
    const editor = createEditor()
    let onChangeCount = 0

    editor.children = createParagraphs()
    editor.selection = {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    }
    editor.onChange = () => {
      onChangeCount++
    }

    Editor.withBatch(editor, () => {
      Editor.addMark(editor, 'bold', true)

      assert.equal(onChangeCount, 0)
      assert.deepEqual(editor.marks, { bold: true })
      assert.deepEqual(editor.operations, [])
    })

    assert.equal(onChangeCount, 0)

    await flushMicrotasks()

    assert.equal(onChangeCount, 1)
  })

  it('returns the current draft children without forcing observation normalize when normalization is suspended', () => {
    const editor = createEditor()

    editor.children = createParagraphs()

    Editor.withBatch(editor, () => {
      Editor.withoutNormalizing(editor, () => {
        editor.apply({
          type: 'set_node',
          path: [0],
          properties: {},
          newProperties: { id: 'a' },
        })

        assert.deepEqual(editor.children, [
          { type: 'paragraph', id: 'a', children: [{ text: 'one' }] },
          { type: 'paragraph', children: [{ text: 'two' }] },
        ])

        editor.apply({
          type: 'set_node',
          path: [1],
          properties: {},
          newProperties: { id: 'b' },
        })
      })
    })

    assert.deepEqual(editor.children, [
      { type: 'paragraph', id: 'a', children: [{ text: 'one' }] },
      { type: 'paragraph', id: 'b', children: [{ text: 'two' }] },
    ])
  })
})

describe('Transforms.applyBatch', () => {
  it('applyBatch still routes through transparent apply wrappers', () => {
    const editor = createEditor()
    let applyCount = 0

    editor.children = createParagraphs()

    wrapApply(editor, apply => op => {
      applyCount++
      apply(op)
    })

    Transforms.applyBatch(editor, [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'b' },
      },
    ])

    assert.equal(applyCount, 2)
  })

  it('matches plain replay semantics while deferring flush', async () => {
    const editor = createEditor()
    const replayEditor = createEditor()
    let onChangeCount = 0

    editor.children = createParagraphs()
    replayEditor.children = createParagraphs()
    editor.onChange = () => {
      onChangeCount++
    }

    const ops = [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'b' },
      },
    ]

    Transforms.applyBatch(editor, ops)
    for (const op of ops) {
      replayEditor.apply(op)
    }

    assert.deepEqual(editor.children, replayEditor.children)
    assert.deepEqual(editor.selection, replayEditor.selection)
    assert.deepEqual(editor.operations, ops)
    assert.equal(onChangeCount, 0)

    await flushMicrotasks()

    assert.equal(onChangeCount, 1)
    assert.deepEqual(editor.operations, [])
  })

  it('rebases selection for staged same-parent insert_node batches', () => {
    const editor = createEditor()
    const replayEditor = createEditor()
    const ops = [
      {
        type: 'insert_node',
        path: [0],
        node: { type: 'paragraph', children: [{ text: 'zero' }] },
      },
    ]

    editor.children = createParagraphs()
    replayEditor.children = createParagraphs()
    editor.selection = {
      anchor: { path: [1, 0], offset: 1 },
      focus: { path: [1, 0], offset: 1 },
    }
    replayEditor.selection = JSON.parse(JSON.stringify(editor.selection))

    Transforms.applyBatch(editor, ops)

    for (const op of ops) {
      replayEditor.apply(op)
    }

    assert.deepEqual(editor.selection, replayEditor.selection)
    assert.deepEqual(editor.selection, {
      anchor: { path: [2, 0], offset: 1 },
      focus: { path: [2, 0], offset: 1 },
    })
  })

  it('normalizes every inserted sibling in non-monotonic same-parent insert_node batches', () => {
    const createTaggingEditor = () => {
      const editor = createEditor()
      const { normalizeNode } = editor

      editor.normalizeNode = entry => {
        const [node, path] = entry

        if (
          path.length === 1 &&
          node.type === 'paragraph' &&
          node.tagged !== true
        ) {
          Transforms.setNodes(editor, { tagged: true }, { at: path })
          return
        }

        normalizeNode(entry)
      }

      return editor
    }

    const editor = createTaggingEditor()
    const replayEditor = createTaggingEditor()
    const ops = [
      {
        type: 'insert_node',
        path: [0],
        node: { type: 'paragraph', children: [{ text: 'zero' }] },
      },
      {
        type: 'insert_node',
        path: [0],
        node: { type: 'paragraph', children: [{ text: 'minus one' }] },
      },
    ]

    editor.children = createParagraphs()
    replayEditor.children = createParagraphs()

    Transforms.applyBatch(editor, ops)

    for (const op of ops) {
      replayEditor.apply(op)
    }

    assert.deepEqual(editor.children, replayEditor.children)
    assert.deepEqual(editor.children.slice(0, 2), [
      {
        type: 'paragraph',
        tagged: true,
        children: [{ text: 'minus one' }],
      },
      {
        type: 'paragraph',
        tagged: true,
        children: [{ text: 'zero' }],
      },
    ])
  })

  it('still routes each operation through editor.apply overrides', () => {
    const editor = createEditor()
    const { apply } = editor

    editor.children = createParagraphs()
    editor.apply = op => {
      if (op.type === 'set_node' && op.newProperties.id === 'blue') {
        op = {
          ...op,
          newProperties: { ...op.newProperties, id: 'orange' },
        }
      }

      apply(op)
    }

    Transforms.applyBatch(editor, [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'blue' },
      },
    ])

    assert.deepEqual(editor.children, [
      { type: 'paragraph', id: 'orange', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ])
  })

  it('matches replay when split_node batches are followed by later text ops', () => {
    assertBatchMatchesReplay({
      children: [
        { type: 'paragraph', children: [{ text: 'a' }] },
        { type: 'paragraph', children: [{ text: 'b' }] },
        { type: 'paragraph', children: [{ text: 'c' }] },
      ],
      selection: {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      },
      ops: [
        {
          type: 'split_node',
          path: [0, 0],
          position: 0,
          properties: {},
        },
        {
          type: 'insert_text',
          path: [0, 0],
          offset: 1,
          text: 'Y',
        },
      ],
    })
  })

  it('normalizes text leaves after batched insert_text operations', () => {
    for (const batchEntry of ['applyBatch', 'manualWithBatch']) {
      const editor = createTextTaggingEditor()

      editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]

      runBatchEntry(editor, batchEntry, [
        {
          type: 'insert_text',
          path: [0, 0],
          offset: 3,
          text: '!',
        },
      ])

      assert.deepEqual(editor.children, [
        {
          type: 'paragraph',
          children: [{ text: 'one!', leafTag: '0,0' }],
        },
      ])
    }
  })

  it('normalizes both text leaves after batched text splits', () => {
    for (const batchEntry of ['applyBatch', 'manualWithBatch']) {
      const editor = createTextTaggingEditor()

      editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]

      runBatchEntry(editor, batchEntry, [
        {
          type: 'split_node',
          path: [0, 0],
          position: 1,
          properties: {},
        },
      ])

      assert.deepEqual(editor.children, [
        {
          type: 'paragraph',
          children: [
            { text: 'o', leafTag: '0,0' },
            { text: 'ne', leafTag: '0,1' },
          ],
        },
      ])
    }
  })

  it('rejects dangerous split_node properties in both single and batched paths', () => {
    const createOp = () => ({
      type: 'split_node',
      path: [0, 0],
      position: 1,
      properties: {
        then() {},
      },
    })

    const singleEditor = createEditor()
    singleEditor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]

    assert.throws(() => singleEditor.apply(createOp()), /Cannot set the "then"/)

    for (const batchEntry of ['applyBatch', 'manualWithBatch']) {
      const editor = createEditor()
      editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]

      if (batchEntry === 'applyBatch') {
        assert.throws(
          () => Transforms.applyBatch(editor, [createOp()]),
          /Cannot set the "then"/
        )
      } else {
        assert.throws(() => {
          Editor.withBatch(editor, () => {
            editor.apply(createOp())
          })
        }, /Cannot set the "then"/)
      }
    }
  })

  it('rejects dangerous set_node properties in both single and batched paths', () => {
    const createOp = () => ({
      type: 'set_node',
      path: [0],
      properties: {},
      newProperties: {
        then() {},
      },
    })
    const children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    const singleEditor = createEditor()
    singleEditor.children = deepClone(children)

    assert.throws(() => singleEditor.apply(createOp()), /Cannot set the "then"/)
    assert.throws(
      () => applySetNodeBatchToChildren(deepClone(children), [createOp()]),
      /Cannot set the "then"/
    )
  })

  it('rejects non-numeric indexes in batch-only child helpers', () => {
    const children = [
      { type: 'paragraph', children: [{ text: 'one' }, { text: 'two' }] },
    ]

    assert.throws(
      () =>
        applyDirectTextSplitBatchToChildren(deepClone(children), [
          {
            type: 'split_node',
            path: [0, '0'],
            position: 1,
            properties: {},
          },
        ]),
      /path indexes must be numbers/
    )

    assert.throws(
      () =>
        applyDirectTextMergeBatchToChildren(deepClone(children), [
          {
            type: 'merge_node',
            path: [0, '1'],
            position: 3,
            properties: {},
          },
        ]),
      /path indexes must be numbers/
    )

    assert.throws(
      () =>
        applyTextBatchToChildren(deepClone(children), [
          {
            type: 'insert_text',
            path: [0, '1'],
            offset: 0,
            text: 'x',
          },
        ]),
      /path indexes must be numbers/
    )

    assert.throws(
      () =>
        applySetNodeBatchToChildren(deepClone(children), [
          {
            type: 'set_node',
            path: [0, '0'],
            properties: {},
            newProperties: { id: 'x' },
          },
        ]),
      /path indexes must be numbers/
    )

    assert.throws(
      () =>
        applyInsertNodeBatchToChildren(deepClone(children), [
          {
            type: 'insert_node',
            path: [0, '1'],
            node: { text: 'x' },
          },
        ]),
      /path indexes must be numbers/
    )
  })

  it('matches replay when merge_node batches are followed by later text ops', () => {
    assertBatchMatchesReplay({
      children: [
        { type: 'paragraph', children: [{ text: 'a' }] },
        { type: 'paragraph', children: [{ text: 'b' }] },
        { type: 'paragraph', children: [{ text: 'c' }] },
      ],
      selection: {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      },
      ops: [
        {
          type: 'merge_node',
          path: [1],
          position: 1,
          properties: {},
        },
        {
          type: 'insert_text',
          path: [0, 0],
          offset: 2,
          text: 'Y',
        },
      ],
    })
  })

  it('preserves read-after-apply semantics for custom apply overrides by falling back to replay', () => {
    const editor = createEditor()
    const snapshots = []
    const { apply } = editor

    editor.children = createParagraphs()
    editor.apply = op => {
      apply(op)

      if (op.type === 'set_node') {
        snapshots.push(editor.children.map(node => node.id))
      }
    }

    Transforms.applyBatch(editor, [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'b' },
      },
    ])

    assert.deepEqual(snapshots, [
      ['a', undefined],
      ['a', 'b'],
    ])
  })

  it('preserves read-after-apply semantics for explicit withBatch manual apply loops', async () => {
    const editor = createEditor()
    const snapshots = []
    let onChangeCount = 0
    const { apply } = editor

    editor.children = createParagraphs()
    editor.onChange = () => {
      onChangeCount++
    }
    editor.apply = op => {
      apply(op)

      if (op.type === 'set_node') {
        snapshots.push(editor.children.map(node => node.id))
      }
    }

    Editor.withBatch(editor, () => {
      editor.apply({
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      })
      editor.apply({
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'b' },
      })

      assert.equal(onChangeCount, 0)
    })

    assert.equal(onChangeCount, 0)
    assert.deepEqual(snapshots, [
      ['a', undefined],
      ['a', 'b'],
    ])

    await flushMicrotasks()

    assert.equal(onChangeCount, 1)
  })

  it('fully normalizes block-only parents when a multi-op batch is observed mid-flight', () => {
    const editor = createEditor()
    const { isInline } = editor

    editor.isInline = element =>
      element.inline === true ? true : isInline(element)
    editor.children = createParagraphs()

    let observedChildren

    Editor.withBatch(editor, () => {
      editor.apply({
        type: 'insert_node',
        path: [0],
        node: { inline: true, children: [{ text: 'first' }] },
      })
      editor.apply({
        type: 'insert_node',
        path: [1],
        node: { inline: true, children: [{ text: 'second' }] },
      })

      observedChildren = deepClone(editor.children)
    })

    assert.deepEqual(observedChildren, createParagraphs())
    assert.deepEqual(editor.children, createParagraphs())
  })

  it('does not mutate previously published node references during exact-path fast batches', () => {
    const editor = createEditor()

    editor.children = createParagraphs()

    const firstNode = editor.children[0]
    const secondNode = editor.children[1]

    Transforms.applyBatch(editor, [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'b' },
      },
    ])

    assert.equal(firstNode.id, undefined)
    assert.equal(secondNode.id, undefined)
    assert.notEqual(editor.children[0], firstNode)
    assert.notEqual(editor.children[1], secondNode)
    assert.deepEqual(editor.children, [
      { type: 'paragraph', id: 'a', children: [{ text: 'one' }] },
      { type: 'paragraph', id: 'b', children: [{ text: 'two' }] },
    ])
  })

  it('matches replay semantics for duplicate exact-path writes without mutating the published ref', () => {
    const editor = createEditor()
    const replayEditor = createEditor()

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    replayEditor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]

    const originalNode = editor.children[0]
    const ops = [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'set_node',
        path: [0],
        properties: { id: 'a' },
        newProperties: { id: 'b', role: 'final' },
      },
    ]

    Transforms.applyBatch(editor, ops)

    for (const op of ops) {
      replayEditor.apply(op)
    }

    assert.equal(originalNode.id, undefined)
    assert.equal(originalNode.role, undefined)
    assert.notEqual(editor.children[0], originalNode)
    assert.deepEqual(editor.children, replayEditor.children)
    assert.deepEqual(editor.operations, ops)
  })

  it('keeps committed children untouched for structural ops until the batch commits', () => {
    const editor = createEditor()

    editor.children = createParagraphs()

    const committedBefore = getCommittedChildren(editor)

    Editor.withBatch(editor, () => {
      Transforms.insertNodes(
        editor,
        { type: 'paragraph', children: [{ text: 'three' }] },
        { at: [2] }
      )

      assert.deepEqual(editor.children, [
        { type: 'paragraph', children: [{ text: 'one' }] },
        { type: 'paragraph', children: [{ text: 'two' }] },
        { type: 'paragraph', children: [{ text: 'three' }] },
      ])
      assert.strictEqual(getCommittedChildren(editor), committedBefore)
      assert.deepEqual(getCommittedChildren(editor), createParagraphs())
    })

    assert.notStrictEqual(getCommittedChildren(editor), committedBefore)
    assert.deepEqual(getCommittedChildren(editor), editor.children)
  })

  it('keeps committed children untouched when structural ops follow exact-path set_node writes in the same batch', () => {
    const editor = createEditor()

    editor.children = createParagraphs()

    const committedBefore = getCommittedChildren(editor)

    Editor.withBatch(editor, () => {
      editor.apply({
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      })

      assert.strictEqual(getCommittedChildren(editor), committedBefore)

      Transforms.insertNodes(
        editor,
        { type: 'paragraph', children: [{ text: 'middle' }] },
        { at: [1] }
      )

      assert.deepEqual(editor.children, [
        { type: 'paragraph', id: 'a', children: [{ text: 'one' }] },
        { type: 'paragraph', children: [{ text: 'middle' }] },
        { type: 'paragraph', children: [{ text: 'two' }] },
      ])
      assert.strictEqual(getCommittedChildren(editor), committedBefore)
      assert.deepEqual(getCommittedChildren(editor), createParagraphs())
    })

    assert.deepEqual(getCommittedChildren(editor), editor.children)
  })

  it('treats editor.children assignment inside a batch as draft state, not committed state', () => {
    const editor = createEditor()

    editor.children = createParagraphs()

    const committedBefore = getCommittedChildren(editor)
    const replacement = [
      { type: 'paragraph', children: [{ text: 'replacement' }] },
    ]

    Editor.withBatch(editor, () => {
      editor.children = replacement

      assert.strictEqual(editor.children, replacement)
      assert.strictEqual(getCommittedChildren(editor), committedBefore)
      assert.deepEqual(getCommittedChildren(editor), createParagraphs())
    })

    assert.strictEqual(getCommittedChildren(editor), replacement)
    assert.strictEqual(editor.children, replacement)
  })

  it('drops pre-assignment pending operations and keeps only post-assignment ops in the current batch', () => {
    const editor = createEditor()

    editor.children = createParagraphs()

    Editor.withBatch(editor, () => {
      editor.apply({
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'stale' },
      })
      editor.children = [
        { type: 'paragraph', children: [{ text: 'replacement' }] },
      ]
      editor.apply({
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'final' },
      })

      assert.deepEqual(editor.operations, [
        {
          type: 'set_node',
          path: [0],
          properties: {},
          newProperties: { id: 'final' },
        },
      ])
    })
  })

  it('clears pending live move dirty-path batches when editor.children is assigned inside a batch', () => {
    const editor = createEditor()
    const replacement = [
      { type: 'paragraph', children: [{ text: 'replacement' }] },
    ]

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
      { type: 'paragraph', children: [{ text: 'three' }] },
    ]

    Editor.withBatch(editor, () => {
      editor.apply({
        type: 'move_node',
        path: [2],
        newPath: [0],
      })

      editor.children = replacement
    })

    assert.strictEqual(editor.children, replacement)
    assert.strictEqual(getCommittedChildren(editor), replacement)
  })

  it('clears pending live insert-move dirty-path batches when editor.children is assigned inside a batch', () => {
    const editor = createEditor()
    const replacement = [
      { type: 'paragraph', children: [{ text: 'replacement' }] },
    ]

    editor.children = [
      { type: 'paragraph', children: [{ text: 'zero' }] },
      { type: 'paragraph', children: [{ text: 'one' }] },
    ]

    Editor.withBatch(editor, () => {
      editor.apply({
        type: 'insert_node',
        path: [2],
        node: { type: 'paragraph', children: [{ text: 'two' }] },
      })
      editor.apply({
        type: 'move_node',
        path: [2],
        newPath: [0],
      })

      editor.children = replacement
    })

    assert.strictEqual(editor.children, replacement)
    assert.strictEqual(getCommittedChildren(editor), replacement)
  })

  it('drops stale operations when editor.children is assigned before a pending flush resolves', async () => {
    const editor = createEditor()
    const replacement = [
      { type: 'paragraph', children: [{ text: 'replacement' }] },
    ]
    const onChangeCalls = []

    editor.children = createParagraphs()
    editor.onChange = options => {
      onChangeCalls.push({
        operations: [...editor.operations],
        options,
        children: editor.children,
      })
    }

    editor.apply({
      type: 'set_node',
      path: [0],
      properties: {},
      newProperties: { id: 'stale' },
    })

    editor.children = replacement

    await Promise.resolve()

    assert.deepEqual(onChangeCalls, [
      {
        operations: [],
        options: undefined,
        children: replacement,
      },
    ])
    assert.deepEqual(editor.operations, [])
  })

  it('keeps compatible same-parent insert_node writes on the private insert draft until commit', () => {
    const editor = createEditor()

    editor.children = createParagraphs()

    const committedBefore = getCommittedChildren(editor)

    Editor.withBatch(editor, () => {
      editor.apply({
        type: 'insert_node',
        path: [2],
        node: { type: 'paragraph', children: [{ text: 'three' }] },
      })

      assert.equal(hasInsertNodeDraft(editor), true)
      assert.equal(hasDraftChildren(editor), false)
      assert.strictEqual(getCommittedChildren(editor), committedBefore)
      assert.deepEqual(editor.children, [
        { type: 'paragraph', children: [{ text: 'one' }] },
        { type: 'paragraph', children: [{ text: 'two' }] },
        { type: 'paragraph', children: [{ text: 'three' }] },
      ])

      editor.apply({
        type: 'insert_node',
        path: [3],
        node: { type: 'paragraph', children: [{ text: 'four' }] },
      })

      assert.equal(hasInsertNodeDraft(editor), true)
      assert.equal(hasDraftChildren(editor), false)
      assert.strictEqual(getCommittedChildren(editor), committedBefore)
      assert.deepEqual(editor.children, [
        { type: 'paragraph', children: [{ text: 'one' }] },
        { type: 'paragraph', children: [{ text: 'two' }] },
        { type: 'paragraph', children: [{ text: 'three' }] },
        { type: 'paragraph', children: [{ text: 'four' }] },
      ])
    })

    assert.equal(hasInsertNodeDraft(editor), false)
    assert.equal(hasDraftChildren(editor), false)
    assert.deepEqual(getCommittedChildren(editor), editor.children)
  })

  it('keeps same-parent non-monotonic insert_node writes on the private insert draft until commit', () => {
    const editor = createEditor()

    editor.children = createParagraphs()

    const committedBefore = getCommittedChildren(editor)

    Editor.withBatch(editor, () => {
      editor.apply({
        type: 'insert_node',
        path: [0],
        node: { type: 'paragraph', children: [{ text: 'zero' }] },
      })

      assert.equal(hasInsertNodeDraft(editor), true)
      assert.equal(hasDraftChildren(editor), false)
      assert.strictEqual(getCommittedChildren(editor), committedBefore)
      assert.deepEqual(editor.children, [
        { type: 'paragraph', children: [{ text: 'zero' }] },
        { type: 'paragraph', children: [{ text: 'one' }] },
        { type: 'paragraph', children: [{ text: 'two' }] },
      ])

      editor.apply({
        type: 'insert_node',
        path: [0],
        node: { type: 'paragraph', children: [{ text: 'minus one' }] },
      })

      assert.equal(hasInsertNodeDraft(editor), true)
      assert.equal(hasDraftChildren(editor), false)
      assert.strictEqual(getCommittedChildren(editor), committedBefore)
      assert.deepEqual(editor.children, [
        { type: 'paragraph', children: [{ text: 'minus one' }] },
        { type: 'paragraph', children: [{ text: 'zero' }] },
        { type: 'paragraph', children: [{ text: 'one' }] },
        { type: 'paragraph', children: [{ text: 'two' }] },
      ])
    })

    assert.equal(hasInsertNodeDraft(editor), false)
    assert.equal(hasDraftChildren(editor), false)
    assert.deepEqual(getCommittedChildren(editor), editor.children)
  })

  it('keeps nested same-parent insert_node writes on the private insert draft until commit', () => {
    const editor = createEditor()

    editor.children = [
      {
        type: 'section',
        children: [
          { type: 'paragraph', children: [{ text: 'one' }] },
          { type: 'paragraph', children: [{ text: 'four' }] },
        ],
      },
    ]

    const committedBefore = getCommittedChildren(editor)

    Editor.withBatch(editor, () => {
      editor.apply({
        type: 'insert_node',
        path: [0, 1],
        node: { type: 'paragraph', children: [{ text: 'two' }] },
      })

      assert.equal(hasInsertNodeDraft(editor), true)
      assert.equal(hasDraftChildren(editor), false)
      assert.strictEqual(getCommittedChildren(editor), committedBefore)
      assert.deepEqual(editor.children, [
        {
          type: 'section',
          children: [
            { type: 'paragraph', children: [{ text: 'one' }] },
            { type: 'paragraph', children: [{ text: 'two' }] },
            { type: 'paragraph', children: [{ text: 'four' }] },
          ],
        },
      ])

      editor.apply({
        type: 'insert_node',
        path: [0, 2],
        node: { type: 'paragraph', children: [{ text: 'three' }] },
      })

      assert.equal(hasInsertNodeDraft(editor), true)
      assert.equal(hasDraftChildren(editor), false)
      assert.strictEqual(getCommittedChildren(editor), committedBefore)
      assert.deepEqual(editor.children, [
        {
          type: 'section',
          children: [
            { type: 'paragraph', children: [{ text: 'one' }] },
            { type: 'paragraph', children: [{ text: 'two' }] },
            { type: 'paragraph', children: [{ text: 'three' }] },
            { type: 'paragraph', children: [{ text: 'four' }] },
          ],
        },
      ])
    })

    assert.equal(hasInsertNodeDraft(editor), false)
    assert.equal(hasDraftChildren(editor), false)
    assert.deepEqual(getCommittedChildren(editor), editor.children)
  })

  it('promotes incompatible insert_node batches into the generic draft root without early commit', () => {
    const editor = createEditor()

    editor.children = createParagraphs()

    const committedBefore = getCommittedChildren(editor)

    Editor.withBatch(editor, () => {
      editor.apply({
        type: 'insert_node',
        path: [2],
        node: { type: 'paragraph', children: [{ text: 'three' }] },
      })

      assert.equal(hasInsertNodeDraft(editor), true)
      assert.equal(hasDraftChildren(editor), false)

      editor.apply({
        type: 'insert_node',
        path: [0, 1],
        node: { text: '!' },
      })

      assert.equal(hasInsertNodeDraft(editor), false)
      assert.equal(hasDraftChildren(editor), true)
      assert.strictEqual(getCommittedChildren(editor), committedBefore)
      assert.deepEqual(editor.children, [
        { type: 'paragraph', children: [{ text: 'one!' }] },
        { type: 'paragraph', children: [{ text: 'two' }] },
        { type: 'paragraph', children: [{ text: 'three' }] },
      ])
    })

    assert.equal(hasInsertNodeDraft(editor), false)
    assert.equal(hasDraftChildren(editor), false)
    assert.deepEqual(getCommittedChildren(editor), editor.children)
  })
})
