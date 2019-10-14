/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      o<annotation key="a" />ne
    </element>
    <element>
      tw<annotation key="a" />o
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
  selection: null,
  annotations: {
    a: {
      anchor: {
        path: [0, 0],
        offset: 1,
      },
      focus: {
        path: [1, 0],
        offset: 2,
      },
    },
  },
}
