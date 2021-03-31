/** @jsx jsx */
import { jsx } from '../..'

export const input = (
  <editor>
    <element data>
      before text
      <inline>hyperlink</inline>
      after text
    </element>
  </editor>
)
export const operations = [
  {
    type: 'split_node',
    path: [0],
    position: 1,
    properties: {},
  },
]
export const output = (
  <editor>
    <element data>before text</element>
    <element>
      <text />
      <inline>hyperlink</inline>
      after text
    </element>
  </editor>
)
