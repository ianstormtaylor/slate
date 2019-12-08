/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)

export const run = editor => {
  Editor.mergeNodes(editor, { at: [1, 0], match: 'text' })
}

export const output = (
  <editor>
    <block>onetwo</block>
  </editor>
)
