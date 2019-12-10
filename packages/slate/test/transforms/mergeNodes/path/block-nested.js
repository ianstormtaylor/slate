/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
    </block>
  </editor>
)

export const run = editor => {
  Editor.mergeNodes(editor, {
    at: [1],
    withMatch: ([, p]) => p.length === 1,
  })
}

export const output = (
  <editor>
    <block>
      <block>one</block>
      <block>two</block>
    </block>
  </editor>
)
