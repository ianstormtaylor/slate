/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.insertNodes(
    editor,
    <inline void>
      <text />
    </inline>
  )
}

export const input = (
  <editor>
    <block void>
      <cursor />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block void>
      <cursor />
    </block>
  </editor>
)
