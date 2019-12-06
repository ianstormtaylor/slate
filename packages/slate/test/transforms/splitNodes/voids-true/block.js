/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { at: [0, 1], voids: true })
}

export const input = (
  <editor>
    <block void>
      <block>one</block>
      <block>two</block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block void>
      <block>one</block>
    </block>
    <block void>
      <block>two</block>
    </block>
  </editor>
)
