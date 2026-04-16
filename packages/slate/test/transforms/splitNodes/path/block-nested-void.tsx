/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.splitNodes(editor, { at: [0, 1] })
}
export const input = (
  <editor>
    <block>
      <block void>one</block>
      <block void>two</block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block void>one</block>
    </block>
    <block>
      <block void>two</block>
    </block>
  </editor>
)
