/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setNodeAtPath([0, 0], { key: 'a' })
}

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const output = (
  <value>
    <block>
      <text key="a">word</text>
    </block>
  </value>
)
