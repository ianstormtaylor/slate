/** @jsx jsx */
import { jsx } from '../..'

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
    <block>two</block>
    <block>four</block>
  </editor>
)
