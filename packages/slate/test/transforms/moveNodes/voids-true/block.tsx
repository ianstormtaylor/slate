/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const input = (
  <editor>
    <block void>one</block>
    <block void>two</block>
    <block void>three</block>
  </editor>
)
export const run = (editor) => {
  Transforms.moveNodes(editor, {
    at: [1, 0],
    to: [2, 0],
    voids: true,
  })
}
export const output = (
  <editor>
    <block void>one</block>
    <block void>
      <text />
    </block>
    <block void>twothree</block>
  </editor>
)
