/** @jsx jsx */
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text />
    </element>
    <element>
      <cursor />
      <text />
    </element>
  </editor>
)
export const operations = [
  {
    type: 'remove_node',
    path: [1, 0],
    node: { text: '' },
  },
]
export const output = (
  <editor>
    <element>
      <text />
    </element>
    <element>
      <cursor />
    </element>
  </editor>
)
