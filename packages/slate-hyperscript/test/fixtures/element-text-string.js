/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <element>
    <text>word</text>
  </element>
)

export const output = {
  nodes: [
    {
      text: 'word',
      marks: [],
    },
  ],
}
