/** @jsx jsx */

import { jsx } from '../../../../helpers'

export const run = editor => {
  editor.insertFragment(
    <fragment>
      <block>one</block>
      <block>two</block>
      <block>three</block>
    </fragment>
  )
}

export const input = (
  <value>
    <block>
      word
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>wordone</block>
    <block>two</block>
    <block>
      three
      <cursor />
    </block>
  </value>
)
