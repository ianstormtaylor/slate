/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      o<cursor />
      ne
    </element>
  </value>
)

export const output = {
  children: [
    {
      children: [
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
      offset: 1,
    },
    focus: {
      path: [0, 0],
      offset: 1,
    },
  },
  annotations: {},
}
