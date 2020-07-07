/** @jsx jsx */
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>word</element>
    <selection>
      <anchor path={[0, 0]} offset={1} />
      <focus path={[0, 0]} offset={2} />
    </selection>
  </editor>
)
export const output = {
  children: [
    {
      children: [
        {
          text: 'word',
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
}
