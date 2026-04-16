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
  return Editor.next(editor, { at: [0] })
}
export const output = [<block>two</block>, [1]]
