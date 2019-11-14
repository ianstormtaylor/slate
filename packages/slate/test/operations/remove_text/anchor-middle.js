/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      wo
      <anchor />
      rd
      <focus />
    </element>
  </value>
)

export const operations = [
  {
    type: 'remove_text',
    path: [0, 0],
    offset: 1,
    text: 'or',
  },
]

export const output = (
  <value>
    <element>
      w<anchor />d<focus />
    </element>
  </value>
)
