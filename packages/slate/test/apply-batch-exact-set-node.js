import assert from 'assert'
import { createEditor, Transforms } from 'slate'

describe('Transforms.applyBatch exact-path set_node', () => {
  it('applies multiple exact-path updates and records ordinary set_node ops', () => {
    const editor = createEditor()

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
      { type: 'paragraph', children: [{ text: 'three' }] },
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
        path: [2],
        properties: {},
        newProperties: { id: 'c' },
      },
    ])

    assert.deepEqual(editor.children, [
      { type: 'paragraph', id: 'a', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
      { type: 'paragraph', id: 'c', children: [{ text: 'three' }] },
    ])

    assert.deepEqual(editor.operations, [
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
  })

  it('applies duplicate exact paths in order and keeps the original operations', () => {
    const editor = createEditor()

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]

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

    assert.deepEqual(editor.children, [
      {
        type: 'paragraph',
        id: 'b',
        role: 'final',
        children: [{ text: 'one' }],
      },
    ])

    assert.deepEqual(editor.operations, [
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
  })
})
