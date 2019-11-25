/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  return Editor.after(editor, [0, 0])
}

export const output = { path: [1, 0], offset: 0 }
