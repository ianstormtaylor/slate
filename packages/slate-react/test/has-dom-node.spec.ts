import { createEditor } from 'slate'
import { ReactEditor, withReact } from '../src'

describe('ReactEditor.hasDOMNode', () => {
  test('returns false instead of throwing when the editor is not mounted', () => {
    const editor = withReact(createEditor())
    const target = document.createElement('div')

    expect(ReactEditor.hasDOMNode(editor, target)).toBe(false)
  })
})
