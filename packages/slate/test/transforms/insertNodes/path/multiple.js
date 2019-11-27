/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)

export const run = editor => {
  Editor.insertNodes(editor, [<block>two</block>, <block>three</block>], {
    at: [0],
  })
}

export const output = (
  <editor>
    <block>two</block>
    <block>three</block>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
