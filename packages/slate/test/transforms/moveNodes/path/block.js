/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
    <block>two</block>
  </editor>
)

export const run = editor => {
  Editor.moveNodes(editor, { at: [0], to: [1] })
}

export const output = (
  <editor>
    <block>two</block>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
