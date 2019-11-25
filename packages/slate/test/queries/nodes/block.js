/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  return Array.from(Editor.nodes(editor, { at: [] }))
}

export const output = [
  [
    <value>
      <block>one</block>
    </value>,
    [],
  ],
  [<block>one</block>, [0]],
  [<text>one</text>, [0, 0]],
]
