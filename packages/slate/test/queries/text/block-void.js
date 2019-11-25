/** @jsx jsx  */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block void>
      <text>one</text>
      <text>two</text>
    </block>
  </value>
)

export const run = editor => {
  return Editor.text(editor, [0])
}

export const output = ``
