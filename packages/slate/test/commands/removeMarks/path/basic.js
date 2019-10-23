/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMarks([{ key: 'a' }], { at: [0, 0] })
}

export const input = (
  <value>
    <block>
      <mark key="a">word</mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
  </value>
)
