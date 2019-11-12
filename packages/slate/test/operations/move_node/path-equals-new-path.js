/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>1</element>
    <element>2</element>
  </value>
)

export const operations = [
  {
    type: 'move_node',
    path: [0],
    newPath: [0],
  },
]

export const output = (
  <value>
    <element>1</element>
    <element>2</element>
  </value>
)
