/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>word</text>
      <inline void markable>
        <text bold />
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
export const test = editor => {
  editor.markableVoid = node => node.markable
  return Editor.marks(editor)
}
export const output = { bold: true }
