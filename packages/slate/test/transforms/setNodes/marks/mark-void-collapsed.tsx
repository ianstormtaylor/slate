/** @jsx jsx */
// Apply a mark across a range containing text with other marks and one void that supports marks
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  editor.markableVoid = node => node.markable
  Editor.addMark(editor, 'bold', true)
}
export const input = (
  <editor>
    <block>
      <text>word</text>
      <inline void markable>
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
      <inline void markable>
        <text bold />
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
