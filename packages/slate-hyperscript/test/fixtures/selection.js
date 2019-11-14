/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>word</element>
    <selection>
      <anchor path={[0, 0]} offset={1} />
      <focus path={[0, 0]} offset={2} />
    </selection>
  </value>
)

export const output = {
  children: [
    {
      children: [
        {
          text: 'word',
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
      offset: 2,
    },
  },
  annotations: {},
}
