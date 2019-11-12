/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      properties: {
        thing: v => v == null || v === 'valid',
      },
    },
  },
]

export const input = (
  <value>
    <element a thing="invalid">
      word
    </element>
  </value>
)

export const output = <value />
