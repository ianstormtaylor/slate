/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <cursor />
      one
    </block>
  </value>
)

export const run = editor => {
  Editor.insertNodes(
    editor,
    <block>
      <text />
    </block>,
    { at: [0] }
  )
}

export const output = (
  <value>
    <block>
      <text />
    </block>
    <block>
      <cursor />
      one
    </block>
  </value>
)
