/** @jsx jsx  */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block void>
      <text>one</text>
      <text>two</text>
    </block>
  </editor>
)

export const run = editor => {
  return Editor.text(editor, [0])
}

export const output = ``
