/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteBackward()
}

export const input = (
  <value>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <text>
        <cursor />
      </text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text>
        <cursor />
      </text>
    </block>
  </value>
)
