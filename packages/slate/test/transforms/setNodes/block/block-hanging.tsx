/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { someKey: true },
    { match: n => Editor.isBlock(editor, n) }
  )
}
export const input = (
  <editor>
    <block>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </editor>
)
export const output = (
  <editor>
    <block someKey>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </editor>
)
