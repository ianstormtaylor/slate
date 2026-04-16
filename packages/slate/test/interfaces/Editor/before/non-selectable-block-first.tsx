/** @jsx jsx */

import { Editor } from 'slate'

export const input = (
  <editor>
    <block nonSelectable>two</block>
    <block>three</block>
  </editor>
)

export const test = (editor) => {
  return Editor.before(editor, { path: [1, 0], offset: 0 })
}

export const output = undefined
