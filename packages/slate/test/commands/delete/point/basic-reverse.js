/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete({ reverse: true })
}

export const input = (
  <value>
    <block>one</block>
    <block>
      <cursor />
      two
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <cursor />
      two
    </block>
  </value>
)
