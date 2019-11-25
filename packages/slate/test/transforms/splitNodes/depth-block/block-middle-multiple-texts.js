/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, { match: 'block' })
}

export const input = (
  <value>
    <block>
      <text>
        one
        <cursor />
      </text>
      <text>two</text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      one
      <cursor />
    </block>
    <block>two</block>
  </value>
)
