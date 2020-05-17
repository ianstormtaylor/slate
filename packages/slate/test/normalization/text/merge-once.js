/** @jsx jsx */

import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      <text a>1</text>
      <text a />
      <text>2</text>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text a>1</text>
      <text>2</text>
    </block>
  </editor>
)
