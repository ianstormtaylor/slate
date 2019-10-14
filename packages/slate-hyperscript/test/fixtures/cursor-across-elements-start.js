/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <anchor />one
    </element>
    <element>
      <focus />two
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
      offset: 0,
    },
    focus: {
      path: [1, 0],
      offset: 0,
    },
    isFocused: true,
    marks: null,
  },
  annotations: {},
}
