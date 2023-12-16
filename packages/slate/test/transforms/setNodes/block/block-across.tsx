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
    <block>
      <anchor />
      word
    </block>
    <block>
      a<focus />
      nother
    </block>
  </editor>
)
export const output = (
  <editor>
    <block someKey>
      <anchor />
      word
    </block>
    <block someKey>
      a<focus />
      nother
    </block>
  </editor>
)
