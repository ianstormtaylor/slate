/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.splitNodes(editor, { at: [0, 1] })
}
export const input = (
  <editor>
    <block void>
      <block>one</block>
      <block>two</block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block void>
      <block>one</block>
      <block>two</block>
    </block>
  </editor>
)
