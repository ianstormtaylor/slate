/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
    <block>two</block>
  </editor>
)
export const run = editor => {
  Transforms.moveNodes(editor, {
    match: n => Editor.isBlock(editor, n),
    to: [1],
  })
}
export const output = (
  <editor>
    <block>two</block>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
