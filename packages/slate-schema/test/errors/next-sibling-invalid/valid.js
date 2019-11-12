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
    <element b>two</element>
    <element c>three</element>
  </value>
)

export const output = input
