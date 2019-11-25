/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor)
}

export const input = (
  <value>
    <block>one</block>
    <block>
      <anchor />
      two
    </block>
    <block>
      <focus />
      three
    </block>
  </value>
)

// TODO: the selection is wrong here
export const output = (
  <value>
    <block>one</block>
    <block>
      <cursor />
    </block>
    <block>three</block>
  </value>
)

export const skip = true
