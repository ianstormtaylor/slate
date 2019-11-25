/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { at: [0, 1] })
}

export const input = (
  <value>
    <block>
      <block>one</block>
      <block>two</block>
      <block>three</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
      <block>three</block>
    </block>
  </value>
)
