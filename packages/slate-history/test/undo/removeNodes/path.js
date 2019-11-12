/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.removeNodes({ at: [0] })
}

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const output = input
