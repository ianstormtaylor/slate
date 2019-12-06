/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block void>
      <anchor />
    </block>
    <block>one</block>
    <block>
      tw
      <focus />o
    </block>
    <block>three</block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <cursor />o
    </block>
    <block>three</block>
  </editor>
)
