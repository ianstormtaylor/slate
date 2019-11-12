/** @jsx jsx */

import { jsx } from 'slate-hyperscript'

export const input = (
  <mark type="a">
    <mark type="b">word</mark>
  </mark>
)

export const output = {
  text: 'word',
  marks: [{ type: 'b' }, { type: 'a' }],
}
