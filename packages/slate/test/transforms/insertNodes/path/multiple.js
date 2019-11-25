/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <cursor />
      one
    </block>
  </value>
)

export const run = editor => {
  Editor.insertNodes(editor, [<block>two</block>, <block>three</block>], {
    at: [0],
  })
}

export const output = (
  <value>
    <block>two</block>
    <block>three</block>
    <block>
      <cursor />
      one
    </block>
  </value>
)
