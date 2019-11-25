/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { unit: 'word', reverse: true })
}

export const input = (
  <value>
    <block>word</block>
    <block>
      <cursor />
      another
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      word
      <cursor />
      another
    </block>
  </value>
)
