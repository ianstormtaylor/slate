/** @jsx jsx */

import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.splitNodes(editor, {
    match: n => Editor.isBlock(editor, n),
    at: { path: [0, 0], offset: 2 },
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
