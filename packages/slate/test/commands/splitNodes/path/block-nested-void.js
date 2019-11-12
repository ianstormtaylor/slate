/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ at: [0, 1] })
}

export const input = (
  <value>
    <block>
      <block void>one</block>
      <block void>two</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block void>one</block>
    </block>
    <block>
      <block void>two</block>
    </block>
  </value>
)
