/** @jsx h */

import { h } from '../../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block void>
      <anchor />
    </block>
    <block void>
      <focus />
    </block>
    <block>one</block>
    <block>two</block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />one
    </block>
    <block>two</block>
  </value>
)
