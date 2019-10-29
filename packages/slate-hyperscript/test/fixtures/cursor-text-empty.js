/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text>
        <cursor />
      </text>
    </element>
  </value>
)

export const output = {
  nodes: [
    {
      nodes: [
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
      path: [0, 0],
      offset: 0,
    },
  },
  annotations: {},
}
