/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <editor>
    <block>
      one<inline>two</inline>three<inline>four</inline>five
    </block>
  </editor>
)

export const run = editor => {
  return Array.from(Editor.texts(editor, { at: [], reverse: true }))
}

export const output = [
  [<text>five</text>, [0, 4]],
  [<text>four</text>, [0, 3, 0]],
  [<text>three</text>, [0, 2]],
  [<text>two</text>, [0, 1, 0]],
  [<text>one</text>, [0, 0]],
]
