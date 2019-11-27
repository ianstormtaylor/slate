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
  <editor>
    <element a>
      <element b>one</element>
      <element b>two</element>
      <element c>three</element>
    </element>
  </editor>
)

export const output = (
  <editor>
    <element a>
      <element b>one</element>
      <element b>two</element>
    </element>
  </editor>
)
