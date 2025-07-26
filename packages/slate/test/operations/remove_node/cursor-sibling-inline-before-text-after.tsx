/** @jsx jsx */
import { jsx } from '../../'

export const input = (
  <editor>
    <element>
      <text />
      <inline>a</inline>
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
    path: [0, 2],
    node: { text: '', id: '0' },
  },
]
export const output = (
  <editor>
    <element>
      <text />
      <inline>a</inline>
      <text id="1">
        <cursor />b
      </text>
    </element>
  </editor>
)
