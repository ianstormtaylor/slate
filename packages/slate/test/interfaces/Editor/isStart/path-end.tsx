/** @jsx jsx */
import { Editor } from 'slate'

export const input = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
export const test = (editor) => {
  const { anchor } = editor.selection
  return Editor.isStart(editor, anchor, [0])
}
export const output = false
