/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)

export const run = editor => {
  Editor.insertNodes(
    editor,
    <block>
      <text />
    </block>,
    { at: [0], select: true }
  )
}

export const output = (
  <editor>
    <block>
      <cursor />
    </block>
    <block>one</block>
  </editor>
)
