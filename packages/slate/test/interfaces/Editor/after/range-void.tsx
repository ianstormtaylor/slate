/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>one</block>
    <block void>two</block>
  </editor>
)

export const test = editor => {
  return Editor.after(
    editor,
    {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [1, 0], offset: 2 },
    },
    { voids: true }
  )
}

export const output = { path: [1, 0], offset: 3 }
