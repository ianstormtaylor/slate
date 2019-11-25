/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>one</block>
    <block>two</block>
  </value>
)

export const run = editor => {
  Editor.mergeNodes(editor, { at: [1, 0] })
}

export const output = (
  <value>
    <block>onetwo</block>
  </value>
)
