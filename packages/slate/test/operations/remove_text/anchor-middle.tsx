/** @jsx jsx */
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      wo
      <anchor />
      rd
      <focus />
    </element>
  </editor>
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
  <editor>
    <element>
      w<anchor />d<focus />
    </element>
  </editor>
)
