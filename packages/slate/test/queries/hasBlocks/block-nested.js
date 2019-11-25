/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>
      <block>one</block>
    </block>
  </value>
)

export const run = editor => {
  const block = editor.value.children[0]
  return Editor.hasBlocks(editor, block)
}

export const output = true
