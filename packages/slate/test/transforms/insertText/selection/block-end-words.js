/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, ' a few words')
}

export const input = (
  <value>
    <block>
      word
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      word a few words
      <cursor />
    </block>
  </value>
)
