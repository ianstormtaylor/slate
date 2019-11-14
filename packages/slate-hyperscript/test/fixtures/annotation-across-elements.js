/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      o<annotation key="a" />
      ne
    </element>
    <element>
      tw
      <annotation key="a" />o
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
