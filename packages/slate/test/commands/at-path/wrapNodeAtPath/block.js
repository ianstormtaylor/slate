/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.wrapNodeAtPath([0], <block />)
}

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>word</block>
    </block>
  </value>
)
