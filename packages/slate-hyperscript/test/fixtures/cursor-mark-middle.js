/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <mark>
        o<cursor />
        ne
      </mark>
      two
    </element>
  </editor>
)

export const output = {
  children: [
    {
      children: [
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
      offset: 1,
    },
    focus: {
      path: [0, 0],
      offset: 1,
    },
  },
}
