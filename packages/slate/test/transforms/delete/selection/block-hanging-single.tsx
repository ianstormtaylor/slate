/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      <anchor />
      one
    </block>
    <block>
      <focus />
      two
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
    </block>
    <block>two</block>
  </editor>
)
