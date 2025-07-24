/** @jsx jsx */
import { jsx } from '../../'

export const input = (
  <editor>
    <element>
      <text />
      <inline>
        <text id="0">a</text>
        <text id="1">
          <cursor />
        </text>
      </inline>
      <text>b</text>
    </element>
  </editor>
)
export const operations = [
  {
    type: 'remove_node',
    path: [0, 1, 1],
    node: { text: '', id: '1' },
  },
]
export const output = (
  <editor>
    <element>
      <text />
      <inline>
        <text id="0">
          a<cursor />
        </text>
      </inline>
      <text>b</text>
    </element>
  </editor>
)
