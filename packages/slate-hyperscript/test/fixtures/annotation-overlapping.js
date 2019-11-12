/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      o<annotation key="a" />n<annotation key="b" />e
    </element>
    <element>
      t<annotation key="a" />w<annotation key="b" />o
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
        offset: 1,
      },
    },
    b: {
      anchor: {
        path: [0, 0],
        offset: 2,
      },
      focus: {
        path: [1, 0],
        offset: 2,
      },
    },
  },
}
