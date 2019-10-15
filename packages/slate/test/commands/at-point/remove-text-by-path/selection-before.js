/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPath([0, 0], 0, 1)
}

export const input = (
  <value>
    <block>
      <text>
        w<anchor />or<focus />d
      </text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />or<focus />d
    </block>
  </value>
)
