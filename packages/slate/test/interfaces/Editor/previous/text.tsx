/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Editor, Text } from 'slate'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const test = (editor) => {
  return Editor.previous(editor, { at: [1], match: Text.isText })
}
export const output = [<text>one</text>, [0, 0]]
