/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <element>
        <cursor />word
      </element>
    </element>
  </value>
)

export const output = {
  nodes: [
    {
      nodes: [
        {
          nodes: [
            {
              text: 'word',
              marks: [],
            },
          ],
        },
      ],
    },
  ],
  selection: {
    anchor: {
      path: [0, 0, 0],
      offset: 0,
    },
    focus: {
      path: [0, 0, 0],
      offset: 0,
    },
  },
  annotations: {},
}
