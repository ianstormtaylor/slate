/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete({ at: [0, 0] })
}

export const input = (
  <value>
    <block>
      <text>one</text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
    </block>
  </value>
)
