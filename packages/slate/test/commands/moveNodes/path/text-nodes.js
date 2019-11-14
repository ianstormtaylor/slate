/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>
      <cursor />
      two
    </block>
  </value>
)

export const run = editor => {
  editor.moveNodes({ at: [0, 0], to: [1, 0] })
}

export const output = (
  <value>
    <block>
      <text />
    </block>
    <block>
      one
      <cursor />
      two
    </block>
  </value>
)
