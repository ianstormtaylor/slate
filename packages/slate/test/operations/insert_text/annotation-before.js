/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      w<cursor />
      <annotation key="a">or</annotation>d
    </element>
  </value>
)

export const operations = [
  {
    type: 'insert_text',
    path: [0, 0],
    offset: 1,
    text: 'x',
  },
]

export const output = (
  <value>
    <element>
      wx<cursor />
      <annotation key="a">or</annotation>d
    </element>
  </value>
)
