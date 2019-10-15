/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <text />
      <inline>one</inline>
      <text />
    </block>
  </value>
)

export const run = editor => {
  editor.removeNodeAtPath([0, 1])
}

export const output = (
  <value>
    <block>
      <text />
    </block>
  </value>
)
