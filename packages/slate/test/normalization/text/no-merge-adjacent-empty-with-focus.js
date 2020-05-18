/** @jsx jsx */

import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      <text a>1</text>
      <text b>
        <cursor />
      </text>
      <text c>2</text>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text a>1</text>
      <text b>
        <cursor />
      </text>
      <text c>2</text>
    </block>
  </editor>
)
