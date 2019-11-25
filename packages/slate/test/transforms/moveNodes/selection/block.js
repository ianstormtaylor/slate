/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <cursor />
      one
    </block>
    <block>two</block>
  </value>
)

export const run = editor => {
  Editor.moveNodes(editor, { match: ([, p]) => p.length === 1, to: [1] })
}

export const output = (
  <value>
    <block>two</block>
    <block>
      <cursor />
      one
    </block>
  </value>
)
