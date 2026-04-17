import assert from 'assert'
import { createEditor, Editor, Transforms } from 'slate'
import { assertBatchMatrixManifest } from '../../slate/test/utils/batch-matrix-manifest'
import { HistoryEditor, withHistory } from '../src'

const flushMicrotasks = async () => {
  await Promise.resolve()
}

const HISTORY_BATCH_CASES = [
  {
    id: 'exactUnique',
    initialChildren: [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
      { type: 'paragraph', children: [{ text: 'three' }] },
    ],
    ops: [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'set_node',
        path: [2],
        properties: {},
        newProperties: { id: 'c' },
      },
    ],
    expectedHistoryOps: [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'set_node',
        path: [2],
        properties: {},
        newProperties: { id: 'c' },
      },
    ],
  },
  {
    id: 'duplicateExact',
    initialChildren: [{ type: 'paragraph', children: [{ text: 'one' }] }],
    ops: [
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
    ],
    expectedHistoryOps: [
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
    ],
  },
  {
    id: 'mixedStructural',
    initialChildren: [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ],
    ops: [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'insert_node',
        path: [1],
        node: { type: 'paragraph', children: [{ text: 'middle' }] },
      },
    ],
    expectedHistoryOps: [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
      {
        type: 'insert_node',
        path: [1],
        node: { type: 'paragraph', children: [{ text: 'middle' }] },
      },
    ],
  },
  {
    id: 'mixedTextSelectionNode',
    initialChildren: [{ type: 'paragraph', children: [{ text: 'one' }] }],
    initialSelection: {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    },
    ops: [
      {
        type: 'insert_text',
        path: [0, 0],
        offset: 1,
        text: 'X',
      },
      {
        type: 'set_selection',
        properties: {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [0, 0], offset: 0 },
        },
        newProperties: {
          anchor: { path: [0, 0], offset: 2 },
          focus: { path: [0, 0], offset: 2 },
        },
      },
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'p0' },
      },
    ],
    expectedHistoryOps: [
      {
        type: 'insert_text',
        path: [0, 0],
        offset: 1,
        text: 'X',
      },
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'p0' },
      },
    ],
    expectedSelectionBefore: {
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    },
  },
]

describe('HistoryEditor applyBatch exact-path set_node', () => {
  it('declares the history batch manifest', () => {
    assertBatchMatrixManifest('historyBatchCases', HISTORY_BATCH_CASES.length)
  })

  const runHistoryBatch = (editor, batchEntry, ops) => {
    if (batchEntry === 'applyBatch') {
      Transforms.applyBatch(editor, ops)
      return
    }

    if (batchEntry === 'manualWithBatch') {
      Editor.withBatch(editor, () => {
        for (const op of ops) {
          editor.apply(op)
        }
      })
      return
    }

    throw new Error(`Unsupported batch entry: ${batchEntry}`)
  }

  const HISTORY_BATCH_MATRIX = ['applyBatch', 'manualWithBatch'].flatMap(
    batchEntry =>
      HISTORY_BATCH_CASES.map(historyCase => ({
        batchEntry,
        historyCase,
        name: `batchEntry=${batchEntry} | scenario=${historyCase.id}`,
      }))
  )

  it('declares the history batch entry matrix manifest', () => {
    assertBatchMatrixManifest(
      'historyBatchEntries',
      HISTORY_BATCH_MATRIX.length
    )
  })

  for (const matrixCase of HISTORY_BATCH_MATRIX) {
    it(matrixCase.name, () => {
      const { batchEntry, historyCase } = matrixCase
      const editor = withHistory(createEditor())

      editor.children = JSON.parse(JSON.stringify(historyCase.initialChildren))
      editor.selection = historyCase.initialSelection
        ? JSON.parse(JSON.stringify(historyCase.initialSelection))
        : null

      runHistoryBatch(editor, batchEntry, historyCase.ops)

      assert.equal(editor.history.undos.length, 1)
      assert.deepEqual(
        editor.history.undos[0].operations,
        historyCase.expectedHistoryOps
      )

      if (historyCase.expectedSelectionBefore) {
        assert.deepEqual(
          editor.history.undos[0].selectionBefore,
          historyCase.expectedSelectionBefore
        )
      }

      editor.undo()

      assert.deepEqual(editor.children, historyCase.initialChildren)

      if (historyCase.initialSelection) {
        assert.deepEqual(editor.selection, historyCase.initialSelection)
      }
    })
  }

  it('merges into the current undo batch when called before the pending flush', () => {
    const editor = withHistory(createEditor())

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ]

    Transforms.setNodes(editor, { id: 'a' }, { at: [0] })
    Transforms.applyBatch(editor, [
      {
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'b' },
      },
    ])

    assert.equal(editor.history.undos.length, 1)
    assert.deepEqual(editor.history.undos[0].operations, [
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

  it('merges into the current undo batch when apply wrappers replace op objects', () => {
    const editor = withHistory(createEditor())
    const { apply } = editor

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ]

    editor.apply = op => {
      if (op.type === 'set_node') {
        apply({ ...op, newProperties: { ...op.newProperties } })
        return
      }

      apply(op)
    }

    Transforms.setNodes(editor, { id: 'a' }, { at: [0] })
    Transforms.applyBatch(editor, [
      {
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'b' },
      },
    ])

    assert.equal(editor.history.undos.length, 1)
    assert.deepEqual(editor.history.undos[0].operations, [
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

  it('starts a fresh undo batch inside HistoryEditor.withNewBatch', () => {
    const editor = withHistory(createEditor())

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ]

    Transforms.setNodes(editor, { id: 'a' }, { at: [0] })

    HistoryEditor.withNewBatch(editor, () => {
      Transforms.applyBatch(editor, [
        {
          type: 'set_node',
          path: [1],
          properties: {},
          newProperties: { id: 'b' },
        },
      ])
    })

    assert.equal(editor.history.undos.length, 2)
    assert.deepEqual(editor.history.undos[0].operations, [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'a' },
      },
    ])
    assert.deepEqual(editor.history.undos[1].operations, [
      {
        type: 'set_node',
        path: [1],
        properties: {},
        newProperties: { id: 'b' },
      },
    ])
  })

  it('drops stale undo state when direct children assignment overwrites prior batched ops', () => {
    const editor = withHistory(createEditor())

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
      editor.children = [
        { type: 'paragraph', children: [{ text: 'replacement' }] },
      ]
    })

    assert.equal(editor.history.undos.length, 0)
  })

  it('keeps only post-assignment ops in history when later batched ops run on the replacement tree', () => {
    const editor = withHistory(createEditor())

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ]

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
    })

    assert.equal(editor.history.undos.length, 1)
    assert.deepEqual(editor.history.undos[0].operations, [
      {
        type: 'set_node',
        path: [0],
        properties: {},
        newProperties: { id: 'final' },
      },
    ])

    editor.undo()

    assert.deepEqual(editor.children, [
      { type: 'paragraph', children: [{ text: 'replacement' }] },
    ])
  })

  it('clears previously flushed undo history when direct children assignment replaces the tree', async () => {
    const editor = withHistory(createEditor())

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]
    editor.selection = {
      anchor: { path: [0, 0], offset: 3 },
      focus: { path: [0, 0], offset: 3 },
    }

    Transforms.insertText(editor, 'a')
    await flushMicrotasks()

    Transforms.insertText(editor, 'b')
    editor.children = [
      { type: 'paragraph', children: [{ text: 'replacement' }] },
    ]

    assert.equal(editor.history.undos.length, 0)
    assert.equal(editor.history.redos.length, 0)

    editor.undo()
    editor.redo()

    assert.deepEqual(editor.children, [
      { type: 'paragraph', children: [{ text: 'replacement' }] },
    ])
  })
})
