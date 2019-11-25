/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { at: { path: [0, 0], offset: 2 } })
}

export const input = (
  <value>
    <block void>word</block>
  </value>
)

export const output = (
  <value>
    <block void>word</block>
  </value>
)
