/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <mark>
        one<cursor />
      </mark>
      two
    </element>
  </value>
)

export const output = {
  nodes: [
    {
      nodes: [
        {
          text: 'one',
          marks: [{}],
        },
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
      path: [0, 0],
      offset: 3,
    },
  },
  annotations: {},
}
