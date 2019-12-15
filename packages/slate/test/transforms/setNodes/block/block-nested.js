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
      <block>
        <cursor />
        word
      </block>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <block key>
        <cursor />
        word
      </block>
    </block>
  </editor>
)
