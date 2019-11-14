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
    type: 'remove_node',
    path: [0],
    node: (
      <element>
        o<annotation key="a" />
        ne
      </element>
    ),
  },
]

export const output = (
  <value>
    <element>
      <annotation key="a">tw</annotation>o
    </element>
  </value>
)
