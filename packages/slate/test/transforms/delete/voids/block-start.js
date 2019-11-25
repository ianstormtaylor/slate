/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block void>
      <anchor />
    </block>
    <block>one</block>
    <block>
      tw
      <focus />o
    </block>
    <block>three</block>
  </value>
)

export const output = (
  <value>
    <block>
      <cursor />o
    </block>
    <block>three</block>
  </value>
)
