/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertText(editor, ' a few words ')
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
      w a few words <cursor />
      ord
    </block>
  </value>
)
