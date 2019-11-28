/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <mark>
    <text>word</text>
  </mark>
)

export const output = {
  text: 'word',
  marks: [{}],
}
