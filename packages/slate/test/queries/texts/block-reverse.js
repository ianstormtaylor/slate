/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)

export const run = editor => {
  return Array.from(Editor.texts(editor, { at: [], reverse: true }))
}

export const output = [
  [<text>two</text>, [1, 0]],
  [<text>one</text>, [0, 0]],
]
