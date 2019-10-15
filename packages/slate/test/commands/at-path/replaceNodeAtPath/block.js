/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceNodeAtPath([1], <block>another</block>)
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
    <block>another</block>
  </value>
)
