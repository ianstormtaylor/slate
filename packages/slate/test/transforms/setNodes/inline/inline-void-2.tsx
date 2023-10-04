/** @jsx jsx */
import { Editor, Transforms, Element } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { someKey: true },
    { match: n => Element.isElement(n) && Editor.isInline(editor, n) }
  )
}
export const input = (
  <editor>
    <block>
      <text>word</text>
      <inline void alreadyHasAKey>
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
      <inline void alreadyHasAKey someKey>
        <text />
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
