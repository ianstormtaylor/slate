/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.removeMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <anchor />
      <mark key="a">word</mark>
      <focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />
      word
      <focus />
    </block>
  </value>
)
