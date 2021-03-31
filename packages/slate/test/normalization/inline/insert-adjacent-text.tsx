/** @jsx jsx */
import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      <inline>one</inline>
      <inline>two</inline>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>one</inline>
      <text />
      <inline>two</inline>
      <text />
    </block>
  </editor>
)
