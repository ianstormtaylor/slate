/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>zero</block>
    <block>
      <block>one</block>
      <block>two</block>
    </block>
    <block>
      <block>three</block>
    </block>
  </editor>
)
export const test = value => {
  return Node.fragment(value, {
    anchor: { path: [2, 0, 0], offset: 2 },
    focus: { path: [1, 1, 0], offset: 1 },
  })
}
export const output = [
  <block>
    <block>wo</block>
  </block>,
  <block>
    <block>th</block>
  </block>,
]
