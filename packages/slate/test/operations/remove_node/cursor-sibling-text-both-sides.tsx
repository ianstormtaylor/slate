/** @jsx jsx */
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text id="0">a</text>
      <text id="1">
        <cursor />
      </text>
      <text id="2">b</text>
    </element>
  </editor>
)
export const operations = [
  {
    type: 'remove_node',
    path: [0, 1],
    node: { text: '', id: '1' },
  },
]
export const output = (
  <editor>
    <element>
      <text id="0">
        a<cursor />
      </text>
      <text id="2">b</text>
    </element>
  </editor>
)
