/** @jsx jsx  */

import { jsx } from '../../helpers'

export const input = (
  <value>
    <block void>
      <text>one</text>
      <text>two</text>
    </block>
  </value>
)

export const run = editor => {
  return editor.getText([0])
}

export const output = ``
