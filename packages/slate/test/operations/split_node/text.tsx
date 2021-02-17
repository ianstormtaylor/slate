/** @jsx jsx */
import { jsx } from '../..'

export const input = (
  <editor>
    <element>
      <text bold>some text</text>
    </element>
  </editor>
)
export const operations = [
  {
    type: 'split_node',
    path: [0, 0],
    position: 5,
    properties: {
      bold: true,
    },
  },
  {
    type: 'split_node',
    path: [0],
    position: 1,
    properties: {},
  },
]
export const output = (
  <editor>
    <element>
      <text bold>some </text>
    </element>
    <element>
      <text bold>text</text>
    </element>
  </editor>
)
