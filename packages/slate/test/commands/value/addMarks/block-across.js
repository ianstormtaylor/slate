/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.addMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      wo<anchor />rd
    </block>
    <block>
      an<focus />other
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo
      <mark key="a">
        <anchor />rd
      </mark>
    </block>
    <block>
      <mark key="a">an</mark>
      <text>
        <focus />other
      </text>
    </block>
  </value>
)
