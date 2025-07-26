/** @jsx jsx */
import { jsx } from '../../'

export const input = (
  <editor>
    <element>
      <text>a</text>
      <inline>
        <text id="0">
          <cursor />
        </text>
        <text id="1">b</text>
      </inline>
      <text />
    </element>
  </editor>
)
export const operations = [
  {
    type: 'remove_node',
    path: [0, 1, 0],
    node: { text: '', id: '0' },
  },
]
export const output = (
  <editor>
    <element>
      <text>a</text>
      <inline>
        <text id="1">
          <cursor />b
        </text>
      </inline>
      <text />
    </element>
  </editor>
)
