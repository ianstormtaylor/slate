/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPoint({ path: [0, 0], offset: 2 }, 1)
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
      w<anchor />o<focus />d
    </block>
  </value>
)
