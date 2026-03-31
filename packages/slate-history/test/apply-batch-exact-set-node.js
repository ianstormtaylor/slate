import assert from 'assert'
import { createEditor, Transforms } from 'slate'
import { HistoryEditor, withHistory } from '..'

describe('HistoryEditor applyBatch exact-path set_node', () => {
  it('stores one undo batch containing the original set_node operations', () => {
    const editor = withHistory(createEditor())
    const initialChildren = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
      { type: 'paragraph', children: [{ text: 'three' }] },
    ]

    editor.children = JSON.parse(JSON.stringify(initialChildren))

    Transforms.applyBatch(editor, [
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
        path: [2],
        properties: {},
        newProperties: { id: 'c' },
      },
    ])

    editor.undo()

    assert.deepEqual(editor.children, initialChildren)
  })

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

  it('keeps exact-path undo semantics intact without routing through removed public batch APIs', () => {
    const editor = withHistory(createEditor())

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ]

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

  it('undoes duplicate exact-path writes in original operation order', () => {
    const editor = withHistory(createEditor())
    const initialChildren = [{ type: 'paragraph', children: [{ text: 'one' }] }]

    editor.children = JSON.parse(JSON.stringify(initialChildren))

    Transforms.applyBatch(editor, [
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
        path: [0],
        properties: { id: 'a' },
        newProperties: { id: 'b', role: 'final' },
      },
    ])

    editor.undo()

    assert.deepEqual(editor.children, initialChildren)
  })

  it('stores mixed exact-path and structural operations in one undo batch', () => {
    const editor = withHistory(createEditor())
    const initialChildren = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ]

    editor.children = JSON.parse(JSON.stringify(initialChildren))

    Transforms.applyBatch(editor, [
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
        type: 'insert_node',
        path: [1],
        node: { type: 'paragraph', children: [{ text: 'middle' }] },
      },
    ])

    editor.undo()

    assert.deepEqual(editor.children, initialChildren)
  })
})
