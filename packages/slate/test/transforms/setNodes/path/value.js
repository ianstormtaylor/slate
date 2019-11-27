/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(editor, { key: true }, { at: [] })
}

export const input = (
  <editor>
    <block>word</block>
    <block>another</block>
  </editor>
)

export const output = (
  <editor key>
    <block>word</block>
    <block>another</block>
  </editor>
)
