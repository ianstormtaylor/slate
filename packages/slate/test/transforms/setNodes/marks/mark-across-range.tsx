/** @jsx jsx */
// Apply a mark across a range containing text with other marks and a void
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMark(editor, 'bold', true)
}
export const input = (
  <editor>
    <block>
      <text>
        <anchor />
        word{' '}
      </text>
      <text italic>italic words </text>
      <inline void>
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
      <text italic bold>
        italic words{' '}
      </text>
      <inline void>
        <text />
      </inline>
      <text underline bold>
        {' '}
        underlined words
        <focus />
      </text>
    </block>
  </editor>
)
