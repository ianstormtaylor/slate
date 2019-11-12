/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      last: [{ b: true }],
    },
  },
]

export const input = (
  <value>
    <element a>
      <element b>one</element>
      <element b>two</element>
      <element c>three</element>
    </element>
  </value>
)

export const output = (
  <value>
    <element a>
      <element b>one</element>
      <element b>two</element>
    </element>
  </value>
)
