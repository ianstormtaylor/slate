/** @jsx jsx */
import { jsx } from '../..'

export const withFallbackElement = true

export const input = (
  <editor>
    <text>one</text>
    <block>two</block>
    <text>three</text>
    <block>four</block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text>one</text>
    </block>
    <block>two</block>
    <block>
      <text>three</text>
    </block>
    <block>four</block>
  </editor>
)
