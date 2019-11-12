/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.splitNodes()
}

export const input = (
  <value>
    <block void>
      wo<anchor />rd
    </block>
    <block>
      an<focus />other
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />other
    </block>
  </value>
)
