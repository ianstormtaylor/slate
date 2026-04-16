/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor } from 'slate'

export const input = (
  <editor>
    <block>one</block>
  </editor>
)
export const test = (editor) => {
  return Editor.start(editor, { path: [0, 0], offset: 1 })
}
export const output = { path: [0, 0], offset: 1 }
