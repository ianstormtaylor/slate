/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: 'element',
    validate: {
      marks: [{ a: true }],
    },
  },
]

export const input = (
  <value>
    <element>
      <mark a>text</mark>
    </element>
  </value>
)

export const output = input
