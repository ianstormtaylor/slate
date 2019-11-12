/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <fragment>
    <element>word</element>
  </fragment>
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
