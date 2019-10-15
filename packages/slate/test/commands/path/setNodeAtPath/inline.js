/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.setNodeAtPath([0, 1], { key: 'a' })
}

export const input = (
  <value>
    <block>
      <text />
      <inline>word</inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline key="a">word</inline>
      <text />
    </block>
  </value>
)
