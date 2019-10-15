/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text>one</text>
      <text>two</text>
      <text>three</text>
    </element>
  </value>
)

export const test = value => {
  return Node.offset(value, [0, 2])
}

export const output = 6
