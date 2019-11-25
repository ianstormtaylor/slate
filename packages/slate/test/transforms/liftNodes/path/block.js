/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.liftNodes(editor, { at: [0, 0] })
}

export const input = (
  <value>
    <block>
      <block>word</block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
  </value>
)
