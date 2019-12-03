/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      children: [{ match: [{ b: true }, { c: true }] }],
    },
  },
]

export const input = (
  <editor>
    <element a>
      <element b>one</element>
      <element d>two</element>
    </element>
  </editor>
)

export const output = (
  <editor>
    <element a>
      <element b>one</element>
    </element>
  </editor>
)
