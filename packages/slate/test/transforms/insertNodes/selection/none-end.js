/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>one</block>
  </value>
)

export const run = editor => {
  Editor.insertNodes(editor, <block>two</block>)
}

export const output = (
  <value>
    <block>one</block>
    <block>
      two
      <cursor />
    </block>
  </value>
)
