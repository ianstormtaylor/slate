/** @jsx jsx */
import { jsx } from '../..'

export const run = editor => {
  editor.insertText('text')
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
