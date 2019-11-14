/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <fragment>
    <element>word</element>
  </fragment>
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
}
