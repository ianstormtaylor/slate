/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { match: 'block' })
}

export const input = (
  <editor>
    <block>
      <text>
        one
        <cursor />
      </text>
      <text>two</text>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      one
      <cursor />
    </block>
    <block>two</block>
  </editor>
)
