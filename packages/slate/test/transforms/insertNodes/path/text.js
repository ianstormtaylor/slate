/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <cursor />
      word
    </block>
  </value>
)

export const run = editor => {
  Editor.insertNodes(editor, <text>another</text>, { at: [0, 0] })
}

export const output = (
  <value>
    <block>
      another
      <cursor />
      word
    </block>
  </value>
)
