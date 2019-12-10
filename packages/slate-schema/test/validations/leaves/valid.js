/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const schema = [
  {
    for: 'node',
    match: { a: true },
    validate: {
      leaves: {
        bold: v => v === true || v === undefined,
      },
    },
  },
]

export const input = (
  <editor>
    <element a>
      <text bold>word</text>
    </element>
  </editor>
)

export const output = (
  <editor>
    <element a>
      <text bold>word</text>
    </element>
  </editor>
)
