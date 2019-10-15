/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />one
    </block>
  </value>
)

export const run = editor => {
  editor.insertNodeAtPath(
    [0],
    <block>
      <text />
    </block>
  )
}

export const output = (
  <value>
    <block>
      <text />
    </block>
    <block>
      <cursor />one
    </block>
  </value>
)
