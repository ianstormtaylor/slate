/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(editor, { key: true }, { at: [] })
}

export const input = (
  <value>
    <block>word</block>
    <block>another</block>
  </value>
)

export const output = (
  <value key>
    <block>word</block>
    <block>another</block>
  </value>
)
