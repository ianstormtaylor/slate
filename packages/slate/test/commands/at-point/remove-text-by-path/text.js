/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPath([0, 0], 3, 1)
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
    <block>wor</block>
  </value>
)
