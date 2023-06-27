/** @jsx jsx */
import { jsx } from '../..'

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
    <block>two</block>
    <block>four</block>
  </editor>
)
