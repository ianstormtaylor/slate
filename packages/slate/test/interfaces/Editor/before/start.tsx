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
  return Editor.before(editor, [0, 0])
}

export const output = undefined
