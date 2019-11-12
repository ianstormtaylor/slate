/** @jsx jsx */

import { jsx } from '../../../../helpers'

export const run = editor => {
  editor.insertFragment(
    <block>
      <text>one</text>
      <inline>Some inline stuff</inline>
      <text>two</text>
    </block>
  )
}

export const input = (
  <value>
    <block>
      A<cursor />B
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      Aone<inline>Some inline stuff</inline>two
      <cursor />B
    </block>
  </value>
)
