/** @jsx jsx */

import { jsx } from '../../../helpers'

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
      <block>
        word
        <cursor />
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>wordone</block>
      <block>two</block>
      <block>
        three
        <cursor />
      </block>
    </block>
  </value>
)
