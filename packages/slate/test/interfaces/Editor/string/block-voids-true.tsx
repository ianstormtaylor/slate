/** @jsx jsx  */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>
      <text>one</text>
      <text>two</text>
    </block>
  </editor>
)
export const test = editor => {
  return Editor.string(editor, [0], { voids: true })
}
export const output = `onetwo`
