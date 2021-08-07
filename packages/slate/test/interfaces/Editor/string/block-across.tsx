/** @jsx jsx  */
import { Editor } from 'slate'
import { jsx } from '../../..'

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
export const test = editor => {
  return Editor.string(editor, [])
}
export const output = `onetwothreefour`
