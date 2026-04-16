/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor } from 'slate'

export const input = (
  <editor>
    <block>
      on
      <cursor />e
    </block>
  </editor>
)
export const test = (editor) => {
  const { anchor } = editor.selection
  return Editor.isEnd(editor, anchor, [0])
}
export const output = false
