/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { at: [0, 1] })
}

export const input = (
  <editor>
    <block>
      <block void>one</block>
      <block void>two</block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <block void>one</block>
    </block>
    <block>
      <block void>two</block>
    </block>
  </editor>
)
