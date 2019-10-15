/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />one
    </block>
    <block>two</block>
  </value>
)

export const run = editor => {
  editor.moveNodeAtPath([0], [1])
}

export const output = (
  <value>
    <block>two</block>
    <block>
      <cursor />one
    </block>
  </value>
)
