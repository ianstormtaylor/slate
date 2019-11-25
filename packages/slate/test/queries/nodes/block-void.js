/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block void>one</block>
  </value>
)

export const run = editor => {
  return Array.from(Editor.nodes(editor, { at: [] }))
}

export const output = [
  [
    <value>
      <block void>one</block>
    </value>,
    [],
  ],
  [<block void>one</block>, [0]],
]
