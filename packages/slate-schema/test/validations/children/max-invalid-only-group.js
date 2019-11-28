/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      children: [{ max: 1 }],
    },
  },
]

export const input = (
  <editor>
    <element a>
      <element b>one</element>
      <element b>two</element>
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
