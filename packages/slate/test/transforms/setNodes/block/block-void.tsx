/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { key: true },
    { match: n => Editor.isBlock(editor, n) }
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
    <block void key>
      <cursor />
      word
    </block>
  </editor>
)
