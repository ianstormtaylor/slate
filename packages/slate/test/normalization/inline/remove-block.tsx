/** @jsx jsx */
import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      <text />
      <inline>
        <block>one</block>
        <text>two</text>
        <block>three</block>
        <text>four</text>
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        <text>twofour</text>
      </inline>
      <text />
    </block>
  </editor>
)
