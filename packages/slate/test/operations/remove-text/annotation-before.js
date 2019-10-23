/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <annotation key="a">w</annotation>ord
    </element>
  </value>
)

export const operations = [
  {
    type: 'remove_text',
    path: [0, 0],
    offset: 1,
    text: 'or',
    marks: [],
  },
]

export const output = (
  <value>
    <element>
      <annotation key="a">w</annotation>d
    </element>
  </value>
)
