/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.splitNodes(editor)
}
export const input = (
  <editor>
    <block>
      w<anchor />
      or
      <focus />d
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>w</block>
    <block>
      <cursor />d
    </block>
  </editor>
)
