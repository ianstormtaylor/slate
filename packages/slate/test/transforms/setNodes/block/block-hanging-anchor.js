/** @jsx jsx */

import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { key: true },
    { match: n => Editor.isBlock(editor, n), hangingAnchor: false }
  )
}

export const input = (
  <editor>
    <block>
      first
      <anchor />
    </block>
    <block>
      word
      <focus />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      first
      <anchor />
    </block>
    <block key>
      word
      <focus />
    </block>
  </editor>
)
