/** @jsx jsx  */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one<inline>two</inline>three
    </block>
  </editor>
)
export const test = editor => {
  return Editor.string(editor, [0, 1])
}
export const output = `two`
