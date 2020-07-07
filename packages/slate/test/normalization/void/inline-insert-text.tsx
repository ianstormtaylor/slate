/** @jsx jsx */
import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      <text />
      <inline void />
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
