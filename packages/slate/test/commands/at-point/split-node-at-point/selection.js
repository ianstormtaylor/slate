/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodeAtPoint({ path: [0, 0], offset: 2 }, { height: 1 })
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
      w<anchor />o
    </block>
    <block>
      r<focus />d
    </block>
  </value>
)
