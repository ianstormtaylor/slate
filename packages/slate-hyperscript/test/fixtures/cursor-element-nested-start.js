/** @jsx jsx */
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <element>
        <cursor />
        word
      </element>
    </element>
  </editor>
)
export const output = {
  children: [
    {
      children: [
        {
          children: [
            {
              text: 'word',
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
}
