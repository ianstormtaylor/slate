/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>1</block>
    <block>2</block>
  </value>
)

export const run = editor => {
  Editor.moveNodes(editor, { at: [1], to: [1] })
}

export const output = (
  <value>
    <block>1</block>
    <block>2</block>
  </value>
)
