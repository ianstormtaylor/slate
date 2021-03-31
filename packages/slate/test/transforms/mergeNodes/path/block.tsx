/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const run = editor => {
  Transforms.mergeNodes(editor, { at: [1] })
}
export const output = (
  <editor>
    <block>onetwo</block>
  </editor>
)
