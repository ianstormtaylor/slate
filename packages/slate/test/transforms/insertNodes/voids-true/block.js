/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>
      one
      <cursor />
    </block>
  </editor>
)

export const run = editor => {
  Editor.insertNodes(editor, <text>two</text>, {
    at: [0, 1],
    voids: true,
  })
}

export const output = (
  <editor>
    <block void>
      one
      <cursor />
      two
    </block>
  </editor>
)
