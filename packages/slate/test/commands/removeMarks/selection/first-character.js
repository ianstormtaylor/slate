/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.removeMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <anchor />
      <mark key="a">w</mark>
      <focus />ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />w<focus />ord
    </block>
  </value>
)
