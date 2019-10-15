/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  editor.moveNodeAtPath([1, 0], [0, 1])
}

export const output = (
  <value>
    <block>onetwo</block>
    <block>
      <text />
    </block>
  </value>
)
