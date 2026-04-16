/** @jsx jsx */
import { Editor, Element, Transforms } from 'slate'

export const run = (editor) => {
  Transforms.setNodes(
    editor,
    { someKey: true },
    { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
  )
}
export const input = (
  <editor>
    <block void>
      <cursor />
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block someKey void>
      <cursor />
      word
    </block>
  </editor>
)
