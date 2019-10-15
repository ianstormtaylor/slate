/** @jsx h */

import { h } from '../../../helpers'

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <cursor />one
      </inline>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </value>
)

export const run = editor => {
  editor.moveNodeAtPath([0, 1], [0, 3])
}

export const output = (
  <value>
    <block>
      <text />
      <inline>two</inline>
      <text />
      <inline>
        <cursor />one
      </inline>
      <text />
    </block>
  </value>
)
