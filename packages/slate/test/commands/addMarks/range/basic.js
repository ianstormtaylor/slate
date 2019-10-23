/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }], {
    at: {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 3 },
    },
  })
}

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const output = (
  <value>
    <block>
      w
      <mark key="a">or</mark>
      d
    </block>
  </value>
)
