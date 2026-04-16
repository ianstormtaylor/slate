/** @jsx jsx */
// Apply a mark across a range containing text with other marks and some voids that support marks
import { Editor } from 'slate'

export const run = (editor) => {
  editor.markableVoid = (node) => node.markable
  Editor.addMark(editor, 'bold', true)
}
export const input = (
  <editor>
    <block>
      <text>
        <anchor />
      </text>
      <inline markable void>
        <text />
      </inline>
      <text italic>italic words </text>
      <inline markable void>
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
      <inline markable void>
        <text bold />
      </inline>
      <text bold italic>
        italic words{' '}
      </text>
      <inline markable void>
        <text bold />
      </inline>
      <text bold>
        <focus />
      </text>
    </block>
  </editor>
)
