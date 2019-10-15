/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.removeTextAtPath([0, 2], 0, 1)
}

export const input = (
  <value>
    <block>
      <text />
      <inline>one</inline>
      <text>a</text>
      <emoji />
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>one</inline>
      <text />
      <emoji />
      <text />
    </block>
  </value>
)
