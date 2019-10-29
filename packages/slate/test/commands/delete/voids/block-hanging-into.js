/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <anchor />one
    </block>
    <block void>
      <focus />two
    </block>
    <block>three</block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
    </block>
    <block>three</block>
  </value>
)
