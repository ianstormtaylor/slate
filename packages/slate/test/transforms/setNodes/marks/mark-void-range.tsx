/** @jsx jsx */
// Apply a mark across a range containing text with other marks and one void that supports marks
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
        word{' '}
      </text>
      <inline void>
        <text />
      </inline>
      <text italic>italic words </text>
      <inline markable void>
        <text />
      </inline>
      <text underline>
        {' '}
        underlined words
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
        word{' '}
      </text>
      <inline void>
        <text />
      </inline>
      <text bold italic>
        italic words{' '}
      </text>
      <inline markable void>
        <text bold />
      </inline>
      <text bold underline>
        {' '}
        underlined words
        <focus />
      </text>
    </block>
  </editor>
)
