/** @jsx jsx  */

import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text />
    </element>
  </value>
)

export const test = value => {
  return Array.from(Node.levels(value, [0, 0], { reverse: true }))
}

export const output = [
  [input.nodes[0].nodes[0], [0, 0]],
  [input.nodes[0], [0]],
  [input, []],
]
