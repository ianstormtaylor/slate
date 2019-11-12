/** @jsx jsx */

import { createHyperscript } from 'slate-hyperscript'

const jsx = createHyperscript({
  annotations: {
    highlight: { type: 'highlight' },
  },
})

export const input = (
  <value>
    <element>
      o<highlight key="a" />
      ne
    </element>
    <element>
      tw
      <highlight key="a" />o
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
      type: 'highlight',
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
