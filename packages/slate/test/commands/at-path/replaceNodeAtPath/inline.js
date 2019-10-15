/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.replaceNodeAtPath([0, 1], <inline>another</inline>)
}

export const input = (
  <value>
    <block>
      one
      <inline>two</inline>
      three
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <inline>another</inline>
      three
    </block>
  </value>
)
