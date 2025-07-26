/** @jsx jsx */
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>a</element>
    <element>
      <text id="0">
        <cursor />
      </text>
      <text id="1">b</text>
    </element>
  </editor>
)
export const operations = [
  {
    type: 'remove_node',
    path: [1, 0],
    node: { text: '', id: '0' },
  },
]
export const output = (
  <editor>
    <element>a</element>
    <element>
      <text id="1">
        <cursor />b
      </text>
    </element>
  </editor>
)
