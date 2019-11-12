/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.moveNodes({ at: [0], to: [1] })
}

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const output = input
