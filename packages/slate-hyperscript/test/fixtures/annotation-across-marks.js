/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <mark>
        o<annotation key="a" />
        ne
      </mark>
    </element>
    <element>
      <mark>
        tw
        <annotation key="a" />o
      </mark>
    </element>
  </value>
)

export const output = {
  children: [
    {
      children: [
        {
          text: 'one',
          marks: [{}],
        },
      ],
    },
    {
      children: [
        {
          text: 'two',
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
        path: [1, 0],
        offset: 2,
      },
    },
  },
}
