/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text>
        <anchor />
      </text>
    </element>
    <element>
      <text>
        <focus />
      </text>
    </element>
  </editor>
)

export const output = {
  children: [
    {
      children: [
        {
          text: '',
          marks: [],
        },
      ],
    },
    {
      children: [
        {
          text: '',
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
}
