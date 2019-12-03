/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      children: [{ min: 2 }],
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

export const output = <editor />
