/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor } from 'slate'

export const input = (
  <editor>
    <block>
      <text>word</text>
      <inline markable void>
        <anchor />
        <text bold />
      </inline>
      <text bold>
        <anchor />
        bold
      </text>
      <inline markable void>
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
export const test = (editor) => {
  editor.markableVoid = (node) => node.markable
  return Editor.marks(editor)
}
export const output = { bold: true }
