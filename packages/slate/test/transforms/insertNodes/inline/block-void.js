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
  <value>
    <block void>
      <cursor />
    </block>
  </value>
)

export const output = (
  <value>
    <block void>
      <cursor />
    </block>
  </value>
)
