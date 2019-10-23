/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <anchor />w<focus />ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">
        <anchor />w<focus />
      </mark>
      ord
    </block>
  </value>
)
