/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { c: true },
    validate: {
      parent: [{ b: true }],
    },
  },
]

export const input = (
  <editor>
    <element a>
      <element a>one</element>
      <element a>two</element>
      <element c>three</element>
    </element>
  </editor>
)

export const output = (
  <editor>
    <element a>
      <element a>one</element>
      <element a>two</element>
    </element>
  </editor>
)
