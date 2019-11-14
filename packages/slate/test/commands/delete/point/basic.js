/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      word
      <cursor />
    </block>
    <block>another</block>
  </value>
)

export const output = (
  <value>
    <block>
      word
      <cursor />
      another
    </block>
  </value>
)
