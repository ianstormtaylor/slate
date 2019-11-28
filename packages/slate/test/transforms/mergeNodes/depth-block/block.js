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
  Editor.mergeNodes(editor, { at: { path: [1, 0], offset: 0 }, match: 'block' })
}

export const output = (
  <editor>
    <block>onetwo</block>
  </editor>
)
