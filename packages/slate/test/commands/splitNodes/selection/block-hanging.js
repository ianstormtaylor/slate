/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes()
}

export const input = (
  <value>
    <block>one</block>
    <block>
      <anchor />
      two
    </block>
    <block>
      <focus />
      three
    </block>
  </value>
)

// TODO: the selection is wrong here
export const output = (
  <value>
    <block>one</block>
    <block>
      <cursor />
    </block>
    <block>three</block>
  </value>
)

export const skip = true
