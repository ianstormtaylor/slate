/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      children: [{ max: 1, match: { b: true } }, { match: { b: true } }],
    },
  },
]

export const input = (
  <editor>
    <element a>
      <element b>one</element>
      <element c>two</element>
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
