/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
    <block>
      <block>two</block>
    </block>
  </editor>
)

export const run = editor => {
  Editor.moveNodes(editor, { at: [0], to: [1, 1] })
}

export const output = (
  <editor>
    <block>
      <block>two</block>
      <block>
        <cursor />
        one
      </block>
    </block>
  </editor>
)
