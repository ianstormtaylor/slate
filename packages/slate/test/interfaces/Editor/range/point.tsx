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
  return Editor.range(editor, { path: [0, 0], offset: 1 })
}
export const output = {
  anchor: { path: [0, 0], offset: 1 },
  focus: { path: [0, 0], offset: 1 },
}
