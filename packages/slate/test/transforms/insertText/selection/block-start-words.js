/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, 'a few words')
}

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      a few words
      <cursor />
      word
    </block>
  </value>
)
