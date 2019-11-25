/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { at: [0, 1] })
}

export const input = (
  <value>
    <block void>
      <block>one</block>
      <block>two</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block void>
      <block>one</block>
      <block>two</block>
    </block>
  </value>
)
