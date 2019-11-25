/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <cursor />
    </block>
    <block>not empty</block>
  </value>
)

export const run = editor => {
  Editor.insertNodes(
    editor,
    <block>
      <text />
    </block>
  )
}

export const output = (
  <value>
    <block>
      <text />
    </block>
    <block>
      <cursor />
    </block>
    <block>not empty</block>
  </value>
)
