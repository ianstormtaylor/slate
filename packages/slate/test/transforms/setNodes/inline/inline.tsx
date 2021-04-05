/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { a: true },
    { match: n => Editor.isInline(editor, n) }
  )
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        <cursor />
        word
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline a>
        <cursor />
        word
      </inline>
      <text />
    </block>
  </editor>
)
