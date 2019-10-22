/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      w<anchor />o<focus />rd
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w
      <mark key="a">
        <anchor />o
      </mark>
      <text>
        <focus />rd
      </text>
    </block>
  </value>
)
