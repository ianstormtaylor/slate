import { createEditor, Transforms, wrapApply } from 'slate'
import { withReact } from '../src'

describe('withReact', () => {
  test('routes applyBatch through the React wrapper chain while preserving exact-path results', () => {
    const editor = withReact(createEditor())
    let applyCount = 0

    editor.children = [
      { type: 'paragraph', children: [{ text: 'one' }] },
      { type: 'paragraph', children: [{ text: 'two' }] },
    ]

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

    expect(applyCount).toBe(2)
    expect(editor.children).toEqual([
      { type: 'paragraph', id: 'a', children: [{ text: 'one' }] },
      { type: 'paragraph', id: 'b', children: [{ text: 'two' }] },
    ])
  })
})
