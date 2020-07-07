/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block void>
      <anchor />
    </block>
    <block void>
      <focus />
    </block>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      one
    </block>
    <block>two</block>
  </editor>
)
