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
  <editor>
    <element a>one</element>
    <element c>two</element>
    <element b>three</element>
  </editor>
)

export const output = (
  <editor>
    <element a>one</element>
    <element b>three</element>
  </editor>
)
