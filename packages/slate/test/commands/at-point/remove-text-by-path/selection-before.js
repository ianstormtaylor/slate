/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPoint({ path: [0, 0], offset: 0 }, 1)
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
