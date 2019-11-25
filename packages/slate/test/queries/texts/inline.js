/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../..'

export const input = (
  <value>
    <block>
      one<inline>two</inline>three
    </block>
  </value>
)

export const run = editor => {
  return Array.from(Editor.texts(editor, { at: [] }))
}

export const output = [
  [<text>one</text>, [0, 0]],
  [<text>two</text>, [0, 1, 0]],
  [<text>three</text>, [0, 2]],
]
