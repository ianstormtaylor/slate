/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }])
  Editor.removeMarks(editor, [{ key: 'a' }])
  Editor.insertText(editor, 'a')
}

export const input = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      a<cursor />
      word
    </block>
  </editor>
)
