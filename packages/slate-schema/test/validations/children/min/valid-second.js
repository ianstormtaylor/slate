/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      children: [{ min: 1, max: 1 }, { min: 1 }],
    },
  },
]

export const input = (
  <editor>
    <element a>
      <element b>one</element>
      <element b>one</element>
    </element>
  </editor>
)

export const output = input
