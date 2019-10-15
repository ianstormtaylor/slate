/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

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
  return Node.offset(value, [1, 1])
}

export const output = 11
