/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      first: [{ b: true }],
    },
  },
]

export const input = (
  <editor>
    <element a>
      <element c>one</element>
      <element b>two</element>
      <element b>three</element>
    </element>
  </editor>
)

export const output = (
  <editor>
    <element a>
      <element b>two</element>
      <element b>three</element>
    </element>
  </editor>
)
