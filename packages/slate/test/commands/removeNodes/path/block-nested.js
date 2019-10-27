/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
    </block>
  </value>
)

export const run = editor => {
  editor.removeNodes({ at: [0, 0] })
}

export const output = (
  <value>
    <block>
      <text />
    </block>
    <block>
      <block>two</block>
    </block>
  </value>
)
