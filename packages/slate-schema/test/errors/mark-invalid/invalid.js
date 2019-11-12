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
      <mark b>text</mark>
    </element>
  </value>
)

export const output = (
  <value>
    <element>text</element>
  </value>
)
