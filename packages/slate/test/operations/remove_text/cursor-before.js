/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      w<cursor />
      ord
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
