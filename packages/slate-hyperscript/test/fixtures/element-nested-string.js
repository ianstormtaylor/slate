/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <element>
    <element>word</element>
  </element>
)

export const output = {
  nodes: [
    {
      nodes: [
        {
          text: 'word',
          marks: [],
        },
      ],
    },
  ],
}
