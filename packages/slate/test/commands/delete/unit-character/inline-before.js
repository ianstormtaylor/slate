/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.delete()
}

export const input = (
  <value>
    <block>
      one
      <inline>two</inline>
      <cursor />a
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <inline>two</inline>
      <cursor />
    </block>
  </value>
)
