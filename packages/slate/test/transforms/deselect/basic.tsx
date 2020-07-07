/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  Transforms.deselect(editor)
}
export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>one</block>
  </editor>
)
