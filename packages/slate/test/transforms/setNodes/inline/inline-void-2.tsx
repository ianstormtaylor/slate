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
      <text>word</text>
      <inline alreadyHasAKey void>
        <text />
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text>word</text>
      <inline alreadyHasAKey someKey void>
        <text />
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
