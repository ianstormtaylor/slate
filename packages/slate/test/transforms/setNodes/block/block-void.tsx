/** @jsx jsx */
import { Editor, Transforms, Element } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { someKey: true },
    { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
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
    <block void someKey>
      <cursor />
      word
    </block>
  </editor>
)
