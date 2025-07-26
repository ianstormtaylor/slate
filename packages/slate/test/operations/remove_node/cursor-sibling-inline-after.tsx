/** @jsx jsx */
import { jsx } from '../../'

export const input = (
  <editor>
    <element>a</element>
    <element>
      <text>
        <cursor />
      </text>
      <inline>b</inline>
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
    <element>a</element>
    <element>
      {/* Recreated by normalizer */}
      <text />
      <inline>
        <cursor />b
      </inline>
      <text />
    </element>
  </editor>
)
