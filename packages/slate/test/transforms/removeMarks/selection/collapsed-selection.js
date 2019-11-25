/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }])
  Editor.removeMarks(editor, [{ key: 'a' }])
  Editor.insertText(editor, 'a')
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
      a<cursor />
      word
    </block>
  </value>
)
