/** @jsx jsx */

import { jsx } from '../../../helpers'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  editor.mergeNodes({ at: [1] })
}

export const output = (
  <value>
    <block>onetwo</block>
  </value>
)
