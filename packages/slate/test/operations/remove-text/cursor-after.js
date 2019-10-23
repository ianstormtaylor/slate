/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      wor<cursor />d
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
      w<cursor />d
    </element>
  </value>
)
