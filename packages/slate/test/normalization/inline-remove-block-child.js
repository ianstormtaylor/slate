/** @jsx jsx */

import { jsx } from '../helpers'

export const schema = {}

export const input = (
  <value>
    <block>
      <text />
      <inline>
        <block>one</block>
        <text>two</text>
      </inline>
      <text />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
      <inline>
        <text>two</text>
      </inline>
      <text />
    </block>
  </value>
)
