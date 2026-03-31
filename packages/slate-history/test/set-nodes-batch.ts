import assert from 'assert'
import { createEditor, Transforms } from 'slate'
import { HistoryEditor, withHistory } from '..'

describe('HistoryEditor setNodesBatch', () => {
  it('stores one undo batch containing the original set_node operations', () => {
    const editor = withHistory(createEditor())
    const initialChildren = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
      { type: 'paragraph', children: [{ text: 'three' }] },
    ]

    editor.children = JSON.parse(JSON.stringify(initialChildren))

    Transforms.setNodesBatch(editor, [
      { at: [0], props: { id: 'a' } },
      { at: [2], props: { id: 'c' } },
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
    Transforms.setNodesBatch(editor, [{ at: [1], props: { id: 'b' } }])

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
      Transforms.setNodesBatch(editor, [{ at: [1], props: { id: 'b' } }])
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
})
