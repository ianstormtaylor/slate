/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>
      <cursor />
      two
    </block>
  </editor>
)

export const run = editor => {
  Editor.mergeNodes(editor, { match: n => Editor.isBlock(editor, n) })
}

export const output = (
  <editor>
    <block>
      one
      <cursor />
      two
    </block>
  </editor>
)
