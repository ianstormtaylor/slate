/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      children: [
        { match: { b: true }, min: 1, max: 1 },
        { match: { c: true }, min: 0 },
      ],
    },
  },
]

export const input = (
  <editor>
    <element a>
      <element b>one</element>
    </element>
  </editor>
)

export const output = input
