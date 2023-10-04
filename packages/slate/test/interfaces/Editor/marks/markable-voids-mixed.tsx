/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>word</text>
      <inline void markable>
        <anchor />
        <text bold />
      </inline>
      <text bold>
        <anchor />
        bold
      </text>
      <inline void markable>
        <text bold italic />
      </inline>
      <text bold italic>
        bold italic
        <focus />
      </text>
      <text />
    </block>
  </editor>
)
export const test = editor => {
  editor.markableVoid = node => node.markable
  return Editor.marks(editor)
}
export const output = { bold: true }
