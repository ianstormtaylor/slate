/** @jsx h */

import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <element>
        word<cursor />
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
      offset: 4,
    },
    focus: {
      path: [0, 0, 0],
      offset: 4,
    },
    isFocused: true,
    marks: null,
  },
  annotations: {},
}
