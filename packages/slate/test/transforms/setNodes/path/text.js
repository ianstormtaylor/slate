/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(editor, { key: 'a' }, { at: [0, 0] })
}

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const output = (
  <value>
    <block>
      <text key="a">word</text>
    </block>
  </value>
)
