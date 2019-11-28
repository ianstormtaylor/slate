/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.splitNodes(editor, {
    at: { path: [0, 0], offset: 2 },
    match: ([, p]) => p.length === 1,
  })
}

export const input = (
  <editor>
    <block>
      <text>word</text>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>wo</block>
    <block>rd</block>
  </editor>
)
