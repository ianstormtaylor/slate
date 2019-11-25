/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const run = editor => {
  Editor.setNodes(editor, { key: 'a' }, { at: [0] })
}

export const output = (
  <value>
    <block key="a">word</block>
  </value>
)
