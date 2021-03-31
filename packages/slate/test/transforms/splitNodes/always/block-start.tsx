/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.splitNodes(editor, {
    match: n => Editor.isBlock(editor, n),
    always: true,
  })
}
export const input = (
  <editor>
    <block>word</block>
    <block>
      <cursor />
      another
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>word</block>
    <block>
      <text />
    </block>
    <block>
      <cursor />
      another
    </block>
  </editor>
)
