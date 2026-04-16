/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block void>
      <anchor />
    </block>
    <block void>
      <text />
    </block>
    <block>
      <focus />
      one
    </block>
    <block>two</block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      one
    </block>
    <block>two</block>
  </editor>
)
