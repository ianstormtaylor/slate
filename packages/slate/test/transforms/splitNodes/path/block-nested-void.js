/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { at: [0, 1] })
}

export const input = (
  <value>
    <block>
      <block void>one</block>
      <block void>two</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block void>one</block>
    </block>
    <block>
      <block void>two</block>
    </block>
  </value>
)
