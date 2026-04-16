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
  return Editor.edges(editor, [0])
}

export const output = [
  { path: [0, 0], offset: 0 },
  { path: [0, 0], offset: 3 },
]
