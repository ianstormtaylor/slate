/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes()
}

export const input = (
  <value>
    <block>
      w<anchor />
      or
      <focus />d
    </block>
  </value>
)

export const output = (
  <value>
    <block>w</block>
    <block>
      <cursor />d
    </block>
  </value>
)
