/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      w<annotation key="a">or</annotation>d
    </element>
  </value>
)

export const operations = [
  {
    type: 'remove_text',
    path: [0, 0],
    offset: 1,
    text: 'o',
  },
]

export const output = (
  <value>
    <element>
      w<annotation key="a">r</annotation>d
    </element>
  </value>
)
