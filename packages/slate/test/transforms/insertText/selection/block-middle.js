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
      ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wa
      <cursor />
      ord
    </block>
  </value>
)
