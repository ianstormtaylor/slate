/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <cursor />one
    </element>
  </value>
)

export const output = {
  nodes: [
    {
      nodes: [
        {
          text: 'one',
          marks: [],
        },
      ],
    },
  ],
  selection: {
    anchor: {
      path: [0, 0],
      offset: 0,
    },
    focus: {
      path: [0, 0],
      offset: 0,
    },
  },
  annotations: {},
}
