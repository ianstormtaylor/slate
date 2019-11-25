/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>
      one
      <cursor />
    </block>
  </value>
)

export const run = editor => {
  const { anchor } = editor.value.selection
  return Editor.isEdge(editor, anchor, [0])
}

export const output = true
