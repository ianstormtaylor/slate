/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      on<anchor />e
    </element>
    <element>
      t<focus />wo
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
      offset: 2,
    },
    focus: {
      path: [1, 0],
      offset: 1,
    },
  },
  annotations: {},
}
