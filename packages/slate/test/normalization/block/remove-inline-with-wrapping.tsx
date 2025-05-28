/** @jsx jsx */
import { jsx } from '../..'

export const withFallbackElement = true

export const input = (
  <editor>
    <block>
      <block>one</block>
      <inline>two</inline>
      <block>three</block>
      <inline>four</inline>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>one</block>
      <block>
        <text />
        <inline>two</inline>
        <text />
      </block>
      <block>three</block>
      <block>
        <text />
        <inline>four</inline>
        <text />
      </block>
    </block>
  </editor>
)
