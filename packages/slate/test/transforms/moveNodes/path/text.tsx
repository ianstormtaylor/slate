/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const run = editor => {
  Transforms.moveNodes(editor, { at: [1, 0], to: [0, 1] })
}
export const output = (
  <editor>
    <block>onetwo</block>
    <block>
      <text />
    </block>
  </editor>
)
