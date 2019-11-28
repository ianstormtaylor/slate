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
  <editor>
    <element a thing="invalid">
      word
    </element>
  </editor>
)

export const output = <editor />
