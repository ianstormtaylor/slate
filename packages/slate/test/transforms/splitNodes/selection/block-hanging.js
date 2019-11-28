/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor)
}

export const input = (
  <editor>
    <block>one</block>
    <block>
      <anchor />
      two
    </block>
    <block>
      <focus />
      three
    </block>
  </editor>
)

// TODO: the selection is wrong here
export const output = (
  <editor>
    <block>one</block>
    <block>
      <cursor />
    </block>
    <block>three</block>
  </editor>
)

export const skip = true
