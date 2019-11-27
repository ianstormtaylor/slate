/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <cursor focused={false} />
    </element>
  </editor>
)

export const output = {
  children: [
    {
      children: [
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
}
