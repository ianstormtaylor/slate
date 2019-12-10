/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      properties: {
        a: true,
      },
    },
  },
]

export const input = (
  <editor>
    <element a thing="unknown">
      word
    </element>
  </editor>
)

export const output = <editor />
