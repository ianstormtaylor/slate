/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <cursor />
    </block>
  </value>
)

export const run = editor => {
  Editor.insertNodes(
    editor,
    <inline void>
      <text />
    </inline>
  )
}

export const output = (
  <value>
    <block>
      <text />
      <inline void>
        <cursor />
      </inline>
      <text />
    </block>
  </value>
)
