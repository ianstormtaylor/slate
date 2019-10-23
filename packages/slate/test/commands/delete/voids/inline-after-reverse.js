/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete({ reverse: true })
}

export const input = (
  <value>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <cursor />
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

export const skip = true
