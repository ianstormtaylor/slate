/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <text>
        w<anchor />or<focus />d
      </text>
    </block>
  </value>
)

export const run = editor => {
  editor.insertText('x', { at: { path: [0, 0], offset: 3 } })
}

export const output = (
  <value>
    <block>
      w<anchor />orx<focus />d
    </block>
  </value>
)
