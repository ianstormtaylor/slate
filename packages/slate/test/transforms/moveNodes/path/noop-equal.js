/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>1</block>
    <block>2</block>
  </editor>
)

export const run = editor => {
  Editor.moveNodes(editor, { at: [1], to: [1] })
}

export const output = (
  <editor>
    <block>1</block>
    <block>2</block>
  </editor>
)
