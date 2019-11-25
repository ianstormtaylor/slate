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
  Editor.removeNodes(editor, { at: [0, 0] })
}

export const output = (
  <value>
    <block>
      <text />
    </block>
    <block>
      <block>two</block>
    </block>
  </value>
)
