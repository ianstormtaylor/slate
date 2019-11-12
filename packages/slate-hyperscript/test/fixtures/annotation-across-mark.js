/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <mark>
        w<annotation key="a">or</annotation>d
      </mark>
    </element>
  </value>
)

export const output = {
  nodes: [
    {
      nodes: [
        {
          text: 'word',
          marks: [{}],
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
        path: [0, 0],
        offset: 3,
      },
    },
  },
}
