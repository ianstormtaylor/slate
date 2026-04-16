/** @jsx jsx */
import { Editor, Element, Transforms } from 'slate'

export const run = (editor) => {
  Transforms.splitNodes(editor, {
    match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
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
