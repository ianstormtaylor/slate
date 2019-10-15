/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text key="a" />
      <text key="b" />
    </element>
  </value>
)

export const test = value => {
  return Array.from(Node.elements(value, { reverse: true }))
}

export const output = [
  [
    <element>
      <text key="a" />
      <text key="b" />
    </element>,
    [0],
  ],
]
