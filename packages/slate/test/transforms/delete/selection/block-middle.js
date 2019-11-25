/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>one</block>
    <block>
      t<anchor />w<focus />o
    </block>
    <block>three</block>
  </value>
)

export const output = (
  <value>
    <block>one</block>
    <block>
      t<cursor />o
    </block>
    <block>three</block>
  </value>
)
