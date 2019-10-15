/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPath([0, 2], 0, 1)
}

export const input = (
  <value>
    <block>
      <text />
      <emoji />
      <text>a</text>
      <inline>two</inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <emoji />
      <text />
      <inline>two</inline>
      <text />
    </block>
  </value>
)
