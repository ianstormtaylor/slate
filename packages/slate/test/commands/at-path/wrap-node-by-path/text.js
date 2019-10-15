/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapNodeAtPath([0, 0], <block />)
}

export const input = (
  <value>
    <block>
      <text>word</text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>word</block>
    </block>
  </value>
)
