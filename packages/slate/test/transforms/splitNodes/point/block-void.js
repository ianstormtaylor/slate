/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { at: { path: [0, 0], offset: 2 } })
}

export const input = (
  <editor>
    <block void>word</block>
  </editor>
)

export const output = (
  <editor>
    <block void>word</block>
  </editor>
)
