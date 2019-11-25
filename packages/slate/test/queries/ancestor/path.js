/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return Editor.ancestor(editor, [0, 0])
}

export const output = [<block>one</block>, [0]]
