/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
    <block>three</block>
    <block>four</block>
  </editor>
)
export const test = value => {
  return Node.fragment(value, {
    anchor: { path: [1, 0], offset: 1 },
    focus: { path: [2, 0], offset: 3 },
  })
}
export const output = [<block>wo</block>, <block>thr</block>]
