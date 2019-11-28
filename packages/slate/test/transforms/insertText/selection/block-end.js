/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'a')
}

export const input = (
  <editor>
    <block>
      word
      <cursor />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      worda
      <cursor />
    </block>
  </editor>
)
