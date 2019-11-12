/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      first: [{ b: true }],
    },
  },
]

export const input = (
  <value>
    <element a>
      <element c>one</element>
    </element>
  </value>
)

export const output = <value />
