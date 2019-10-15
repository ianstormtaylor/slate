/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const run = editor => {
  editor.insertFragmentAtPath(
    [1],
    <fragment>
      <block>one</block>
      <block>two</block>
    </fragment>
  )
}

export const output = (
  <value>
    <block>word</block>
    <block>one</block>
    <block>two</block>
  </value>
)
