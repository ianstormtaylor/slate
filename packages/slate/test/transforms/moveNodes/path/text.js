/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  Editor.moveNodes(editor, { at: [1, 0], to: [0, 1] })
}

export const output = (
  <value>
    <block>onetwo</block>
    <block>
      <text />
    </block>
  </value>
)
