/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.deleteLineBackward()
}

export const input = (
  <value>
    <block>
      <inline void>😊</inline>
      one
      <inline void>😊</inline>
      two
      <inline void>😀</inline>
      three
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />
    </block>
  </value>
)
