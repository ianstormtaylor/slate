/** @jsx jsx */

import { jsx } from '../helpers'

export const input = (
  <value>
    <block>
      <inline>one</inline>
      <inline>two</inline>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>one</inline>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </value>
)
