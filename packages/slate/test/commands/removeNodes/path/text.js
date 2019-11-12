/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  editor.removeNodes({ at: [1, 0] })
}

export const output = (
  <value>
    <block>one</block>
    <block>
      <text />
    </block>
  </value>
)
