/** @jsx jsx */
import { jsx } from '../../'

export const input = (
  <editor>
    <element>
      <text />
      <inline>a</inline>
      <text>
        <cursor />
      </text>
    </element>
    <element>b</element>
  </editor>
)
export const operations = [
  {
    type: 'remove_node',
    path: [0, 2],
    node: { text: '' },
  },
]
export const output = (
  <editor>
    <element>
      <text />
      <inline>
        a<cursor />
      </inline>
      {/* Recreated by normalizer */}
      <text />
    </element>
    <element>b</element>
  </editor>
)
