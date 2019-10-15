/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceNodeAtPath([1, 0], <text>three</text>)
}

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const output = (
  <value>
    <block>one</block>
    <block>three</block>
  </value>
)
