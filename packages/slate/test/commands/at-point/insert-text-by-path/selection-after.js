/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertTextAtPath([0, 0], 4, 'x')
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
      w<anchor />or<focus />dx
    </block>
  </value>
)
