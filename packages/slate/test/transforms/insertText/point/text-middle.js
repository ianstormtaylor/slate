/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>word</text>
    </block>
  </editor>
)

export const run = editor => {
  Editor.insertText(editor, 'x', { at: { path: [0, 0], offset: 2 } })
}

export const output = (
  <editor>
    <block>woxrd</block>
  </editor>
)
