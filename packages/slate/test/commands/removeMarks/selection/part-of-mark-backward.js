/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeMarks([{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <mark key="a">
        wor<focus />d<anchor />
      </mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">wor</mark>
      <text>
        <focus />d<anchor />
      </text>
    </block>
  </value>
)
