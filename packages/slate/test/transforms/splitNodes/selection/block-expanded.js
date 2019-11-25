/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor)
}

export const input = (
  <value>
    <block>
      w<anchor />
      or
      <focus />d
    </block>
  </value>
)

export const output = (
  <value>
    <block>w</block>
    <block>
      <cursor />d
    </block>
  </value>
)
