import assert from 'assert'
import { createEditor, Editor, Transforms } from '../src'
import { getCommittedChildren } from '../src/core/children'
import { wrapApply } from '../src/core/batch'

const flushMicrotasks = async () => {
  await new Promise(resolve => setTimeout(resolve, 0))
}

const createParagraphs = () => [
  { type: 'paragraph', children: [{ text: 'one' }] },
  { type: 'paragraph', children: [{ text: 'two' }] },
]

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
})
