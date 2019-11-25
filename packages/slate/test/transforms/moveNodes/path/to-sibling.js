/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <cursor />
      one
    </block>
    <block>
      <block>two</block>
    </block>
  </value>
)

export const run = editor => {
  Editor.moveNodes(editor, { at: [0], to: [1, 1] })
}

export const output = (
  <value>
    <block>
      <block>two</block>
      <block>
        <cursor />
        one
      </block>
    </block>
  </value>
)
