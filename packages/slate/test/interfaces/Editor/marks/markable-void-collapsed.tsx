/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor } from 'slate'

export const input = (
  <editor>
    <block>
      <text>word</text>
      <inline markable void>
        <text bold />
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
export const test = (editor) => {
  editor.markableVoid = (node) => node.markable
  return Editor.marks(editor)
}
export const output = { bold: true }
