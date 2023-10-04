/** @jsx jsx */
// Apply a mark across a range containing text with other marks and some voids that support marks
import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  editor.markableVoid = node => node.markable
  Editor.addMark(editor, 'bold', true)
}
export const input = (
  <editor>
    <block>
      <text>
        <anchor />
      </text>
      <inline void markable>
        <text />
      </inline>
      <text italic>italic words </text>
      <inline void markable>
        <text />
      </inline>
      <text>
        <focus />
      </text>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text bold>
        <anchor />
      </text>
      <inline void markable>
        <text bold />
      </inline>
      <text italic bold>
        italic words{' '}
      </text>
      <inline void markable>
        <text bold />
      </inline>
      <text bold>
        <focus />
      </text>
    </block>
  </editor>
)
