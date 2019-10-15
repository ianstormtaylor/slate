/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <cursor />word
    </block>
  </value>
)

export const run = editor => {
  editor.insertFragmentAtPath(
    [0],
    <fragment>
      <block>one</block>
      <block>two</block>
    </fragment>
  )
}

export const output = (
  <value>
    <block>one</block>
    <block>two</block>
    <block>
      <cursor />word
    </block>
  </value>
)
