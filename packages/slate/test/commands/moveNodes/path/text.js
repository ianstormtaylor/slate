/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  editor.moveNodes({ at: [1, 0], to: [0, 1] })
}

export const output = (
  <value>
    <block>onetwo</block>
    <block>
      <text />
    </block>
  </value>
)
