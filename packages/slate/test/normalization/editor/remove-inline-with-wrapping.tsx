/** @jsx jsx */
import { jsx } from '../..'

export const withFallbackElement = true

export const input = (
  <editor>
    <inline>one</inline>
    <block>two</block>
    <inline>three</inline>
    <block>four</block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>one</inline>
      <text />
    </block>
    <block>two</block>
    <block>
      <text />
      <inline>three</inline>
      <text />
    </block>
    <block>four</block>
  </editor>
)
