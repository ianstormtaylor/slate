/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>zero</block>
    <block>
      one<inline>two</inline>three
    </block>
  </editor>
)
export const test = value => {
  return Node.fragment(value, {
    anchor: { path: [1, 2], offset: 0 },
    focus: { path: [1, 2], offset: 3 },
  })
}
export const output = [<block>thr</block>]
