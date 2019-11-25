/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>
      on
      <cursor />e
    </block>
  </value>
)

export const run = editor => {
  const { anchor } = editor.value.selection
  return Editor.isEnd(editor, anchor, [0])
}

export const output = false
