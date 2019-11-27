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
      ord
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      wa
      <cursor />
      ord
    </block>
  </editor>
)
