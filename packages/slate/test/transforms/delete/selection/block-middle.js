/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor)
}

export const input = (
  <editor>
    <block>one</block>
    <block>
      t<anchor />w<focus />o
    </block>
    <block>three</block>
  </editor>
)

export const output = (
  <editor>
    <block>one</block>
    <block>
      t<cursor />o
    </block>
    <block>three</block>
  </editor>
)
