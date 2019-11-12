/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  editor.delete({ at: [1] })
}

export const output = (
  <value>
    <block>one</block>
  </value>
)
