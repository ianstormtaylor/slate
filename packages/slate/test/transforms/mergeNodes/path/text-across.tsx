/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Text, Transforms } from 'slate'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const run = (editor) => {
  Transforms.mergeNodes(editor, { at: [1, 0], match: Text.isText })
}
export const output = (
  <editor>
    <block>onetwo</block>
  </editor>
)
