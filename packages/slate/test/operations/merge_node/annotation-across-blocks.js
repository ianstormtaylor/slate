/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      o<annotation key="a" />
      ne
    </element>
    <element>
      tw
      <annotation key="a" />o
    </element>
  </value>
)

export const operations = [
  {
    type: 'merge_node',
    path: [1],
    position: 1,
    properties: {},
    target: null,
  },
  {
    type: 'merge_node',
    path: [0, 1],
    position: 3,
    properties: {},
    target: null,
  },
]

export const output = (
  <value>
    <element>
      o<annotation key="a">netw</annotation>o
    </element>
  </value>
)
