/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  const block = editor.value.children[0]
  return Editor.isEmpty(editor, block)
}

export const output = false
