/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <anchor />wor<focus />d
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
      <anchor />w<focus />d
    </element>
  </value>
)
