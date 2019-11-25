/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
    </block>
  </value>
)

export const run = editor => {
  Editor.moveNodes(editor, { at: [0, 0], to: [1, 0] })
}

export const output = (
  <value>
    <block>
      <text />
    </block>
    <block>
      <block>one</block>
      <block>two</block>
    </block>
  </value>
)
