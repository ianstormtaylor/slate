/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const run = editor => {
  Transforms.moveNodes(editor, { at: [0, 0], to: [1, 0] })
}
export const output = (
  <editor>
    <block>
      <text />
    </block>
    <block>onetwo</block>
  </editor>
)
