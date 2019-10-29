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
    <block>
      <focus />two
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
    </block>
    <block>two</block>
  </value>
)
