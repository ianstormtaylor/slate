/** @jsx jsx  */

import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text>one</text>
      <text>two</text>
    </element>
    <element>
      <text>three</text>
      <text>four</text>
    </element>
  </value>
)

export const test = value => {
  return Node.text(value)
}

export const output = `onetwothreefour`
