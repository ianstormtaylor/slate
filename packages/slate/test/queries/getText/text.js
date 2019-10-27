/** @jsx h  */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      <text>one</text>
      <text>two</text>
    </block>
  </value>
)

export const run = editor => {
  return editor.getText([0, 0])
}

export const output = `one`
