/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  return Array.from(Editor.texts(editor, { at: [] }))
}

export const output = [
  [<text>one</text>, [0, 0]],
  [<text>two</text>, [1, 0]],
]
