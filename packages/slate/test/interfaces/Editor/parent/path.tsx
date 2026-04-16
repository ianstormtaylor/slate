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
  return Editor.parent(editor, [0, 0])
}
export const output = [<block>one</block>, [0]]
