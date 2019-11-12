/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      next: [{ b: true }],
    },
  },
]

export const input = (
  <value>
    <element a>one</element>
    <element c>two</element>
    <element b>three</element>
  </value>
)

export const output = (
  <value>
    <element a>one</element>
    <element b>three</element>
  </value>
)
