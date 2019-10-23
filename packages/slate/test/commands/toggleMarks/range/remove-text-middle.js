/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.toggleMarks([{ key: 'a' }], {
    at: {
      anchor: { path: [0, 1], offset: 0 },
      focus: { path: [0, 1], offset: 2 },
    },
  })
}

export const input = (
  <value>
    <block>
      w
      <mark key="a">or</mark>
      d
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
  </value>
)
