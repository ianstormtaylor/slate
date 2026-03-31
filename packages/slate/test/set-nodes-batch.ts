import assert from 'assert'
import { createEditor, Transforms } from 'slate'

describe('Transforms.setNodesBatch', () => {
  it('applies multiple exact-path updates and records ordinary set_node ops', () => {
    const editor = createEditor()

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
      { type: 'paragraph', children: [{ text: 'three' }] },
    ]

    Transforms.setNodesBatch(editor, [
      { at: [0], props: { id: 'a' } },
      { at: [2], props: { id: 'c' } },
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

  it('rejects duplicate exact paths in one batch', () => {
    const editor = createEditor()

    editor.children = [{ type: 'paragraph', children: [{ text: 'one' }] }]

    assert.throws(() => {
      Transforms.setNodesBatch(editor, [
        { at: [0], props: { id: 'a' } },
        { at: [0], props: { id: 'b' } },
      ])
    }, /duplicate update paths/i)
  })
})
