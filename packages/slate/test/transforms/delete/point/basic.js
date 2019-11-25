/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, )
}

export const input = (
  <value>
    <block>
      word
      <cursor />
    </block>
    <block>another</block>
  </value>
)

export const output = (
  <value>
    <block>
      word
      <cursor />
      another
    </block>
  </value>
)
