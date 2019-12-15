/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(
    editor,
    { key: true },
    { match: n => Editor.isBlock(editor, n) }
  )
}

export const input = (
  <editor>
    <block>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </editor>
)

export const output = (
  <editor>
    <block key>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </editor>
)
