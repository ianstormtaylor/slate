/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)

export const run = editor => {
  return Editor.previous(editor, { at: [1], match: 'block' })
}

export const output = [<block>one</block>, [0]]
