/** @jsx jsx */

import { jsx } from '..'

export const schema = {}

export const input = (
  <editor>
    <block>
      <mark type="a">1</mark>
      <mark type="a">2</mark>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <mark type="a">12</mark>
    </block>
  </editor>
)
