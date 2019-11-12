/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      <anchor />one
    </block>
    <block>two</block>
    <block>
      three
      <inline void>four</inline>
      <focus />five
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />five
    </block>
  </value>
)
