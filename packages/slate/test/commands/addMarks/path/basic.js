/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }], { at: [0, 0] })
}

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">word</mark>
    </block>
  </value>
)
