/** @jsx h */

import h from 'slate-hyperscript'

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
  selection: {
    anchor: {
      path: [0, 0],
      offset: 1,
    },
    focus: {
      path: [0, 0],
      offset: 2,
    },
    isFocused: false,
    marks: null,
  },
  annotations: {},
}
