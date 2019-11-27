/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'a')
}

export const input = (
  <editor>
    <block>
      w<cursor />
      <mark key="a">or</mark>d
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      wa
      <cursor />
      <mark key="a">or</mark>d
    </block>
  </editor>
)
