/** @jsx jsx  */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>
      <text>one</text>
      <text>two</text>
    </block>
  </value>
)

export const run = editor => {
  return Editor.text(editor, [0, 0])
}

export const output = `one`
