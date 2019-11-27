/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>word</block>
  </editor>
)

export const run = editor => {
  Editor.setNodes(editor, { key: 'a' }, { at: [0] })
}

export const output = (
  <editor>
    <block key="a">word</block>
  </editor>
)
