/** @jsx jsx */
import { jsx } from '../..'

export const run = editor => {
  editor.insertText('t')
  editor.insertText('w')
  editor.insertText('o')
}
export const input = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
export const output = input
