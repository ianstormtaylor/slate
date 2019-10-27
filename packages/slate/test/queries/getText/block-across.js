/** @jsx h  */

import { h } from '../../helpers'

export const input = (
  <value>
    <block>
      <text>one</text>
      <text>two</text>
    </block>
    <block>
      <text>three</text>
      <text>four</text>
    </block>
  </value>
)

export const run = editor => {
  return editor.getText([])
}

export const output = `onetwothreefour`
