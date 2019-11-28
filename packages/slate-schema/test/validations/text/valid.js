/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      text: v => v === 'valid',
    },
  },
]

export const input = (
  <editor>
    <element a>valid</element>
  </editor>
)

export const output = input
