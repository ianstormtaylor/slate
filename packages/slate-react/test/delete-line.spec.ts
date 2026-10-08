import { createEditor, Descendant, Node } from 'slate'
import { withReact } from '../src'

describe('deleteBackward with the line unit', () => {
  test('does not throw when the editor has no DOM to measure lines against', () => {
    const editor = withReact(createEditor())
    const initialValue: Descendant[] = [
      { type: 'paragraph', children: [{ text: 'hello world' }] } as Descendant,
    ]
    editor.children = initialValue
    editor.selection = {
      anchor: { path: [0, 0], offset: 11 },
      focus: { path: [0, 0], offset: 11 },
    }

    expect(() => editor.deleteBackward('line')).not.toThrow()
    expect('hello world'.startsWith(Node.string(editor))).toBe(true)
  })
})
