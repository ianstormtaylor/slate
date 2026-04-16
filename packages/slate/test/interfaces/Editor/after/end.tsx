/** @jsx jsx */

import { Editor } from 'slate'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)

export const test = (editor) => {
  return Editor.after(editor, [1, 0])
}

export const output = undefined
