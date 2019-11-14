/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <anchor />
      one
    </element>
    <element>
      <focus />
      two
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
    {
      children: [
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
      offset: 0,
    },
    focus: {
      path: [1, 0],
      offset: 0,
    },
  },
  annotations: {},
}
