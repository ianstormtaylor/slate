/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.splitNodes({ at: [0, 1] })
}

export const input = (
  <value>
    <block void>
      <block>one</block>
      <block>two</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block void>
      <block>one</block>
      <block>two</block>
    </block>
  </value>
)
