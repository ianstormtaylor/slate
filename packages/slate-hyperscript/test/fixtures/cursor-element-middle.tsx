/** @jsx jsx */

import { jsx } from '../jsx'

jsx

export const input = (
  <editor>
    <element>
      o<cursor />
      ne
    </element>
  </editor>
)
export const output = {
  children: [
    {
      children: [
        {
          text: 'one',
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
