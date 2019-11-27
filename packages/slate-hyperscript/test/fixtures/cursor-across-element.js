/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      w<anchor />
      or
      <focus />d
    </element>
  </value>
)

export const output = {
  children: [
    {
      children: [
        {
          text: 'word',
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
      offset: 3,
    },
  },
}
