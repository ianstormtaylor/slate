/** @jsx jsx */

import { jsx } from '../../helpers'

export const run = editor => {
  editor.delete({ reverse: true })
}

export const input = (
  <value>
    <block>Hello</block>
    <block>
      <cursor />world!
    </block>
  </value>
)

export const output = (
  <value>
    <block>Hello</block>
    <block>
      <cursor />world!
    </block>
  </value>
)
