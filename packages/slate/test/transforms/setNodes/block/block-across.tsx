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
    <block key={true}>
      <anchor />
      word
    </block>
    <block key={true}>
      a<focus />
      nother
    </block>
  </editor>
)
