/** @jsx jsx */
import { Editor } from 'slate'

export const input = (
  <editor>
    <block>one</block>
  </editor>
)
export const test = (editor) => {
  const block = editor.children[0]
  return Editor.isEmpty(editor, block)
}
export const output = false
