/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      last: [{ b: true }],
    },
  },
]

export const input = (
  <editor>
    <element a>
      <element c>one</element>
    </element>
  </editor>
)

export const output = <editor />
