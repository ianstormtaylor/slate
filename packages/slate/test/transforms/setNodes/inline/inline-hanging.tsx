/** @jsx jsx */
import { Editor, Element, Transforms } from 'slate'

export const run = (editor) => {
  Transforms.setNodes(
    editor,
    { someKey: true },
    { match: (n) => Element.isElement(n) && Editor.isInline(editor, n) }
  )
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        <anchor />
        word
      </inline>
      <focus />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline someKey>
        <anchor />
        word
      </inline>
      <focus />
    </block>
  </editor>
)
