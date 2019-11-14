/** @jsx jsx */

import { jsx } from '../../../helpers'

const fragment = (
  <fragment>
    <block>one</block>
    <block>two</block>
  </fragment>
)

export const run = editor => {
  editor.insertFragment(fragment)
}

export const input = (
  <value>
    <block>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </value>
)

export const output = (
  <value>
    <block>one</block>
    <block>
      two
      <cursor />
    </block>
    <block>another</block>
  </value>
)
