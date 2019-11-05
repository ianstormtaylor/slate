/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>one</block>
    <block>
      t<anchor />w<focus />o
    </block>
    <block>three</block>
  </value>
)

export const output = (
  <value>
    <block>one</block>
    <block>
      t<cursor />o
    </block>
    <block>three</block>
  </value>
)
