/** @jsx jsx  */
import { Editor } from 'slate'

export const input = (
  <editor>
    <block>
      <text>one</text>
      <text>two</text>
    </block>
    <block>
      <text>three</text>
      <text>four</text>
    </block>
  </editor>
)
export const test = (editor) => {
  return Editor.string(editor, [0])
}
export const output = `onetwo`
