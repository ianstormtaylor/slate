/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      one<anchor />
    </element>
    <element>
      two<focus />
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
    {
      nodes: [
        {
          text: 'two',
          marks: [],
        },
      ],
    },
  ],
  selection: {
    anchor: {
      path: [0, 0],
      offset: 3,
    },
    focus: {
      path: [1, 0],
      offset: 3,
    },
  },
  annotations: {},
}
