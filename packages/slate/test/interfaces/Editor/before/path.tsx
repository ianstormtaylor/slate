/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor } from 'slate'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)

export const test = (editor) => {
  return Editor.before(editor, [1, 0])
}

export const output = { path: [0, 0], offset: 3 }
