/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text />
    </element>
  </value>
)

export const test = value => {
  return Node.descendant(value, [0])
}

export const output = input.nodes[0]
