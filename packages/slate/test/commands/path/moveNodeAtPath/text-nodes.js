/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>
      <cursor />two
    </block>
  </value>
)

export const run = editor => {
  editor.moveNodeAtPath([0, 0], [1, 0])
}

export const output = (
  <value>
    <block>
      <text />
    </block>
    <block>
      one<cursor />two
    </block>
  </value>
)
