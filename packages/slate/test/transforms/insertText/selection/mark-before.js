/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'a')
}

export const input = (
  <value>
    <block>
      w<cursor />
      <mark key="a">or</mark>d
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wa
      <cursor />
      <mark key="a">or</mark>d
    </block>
  </value>
)
