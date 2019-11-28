/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(editor, { key: true }, { match: 'block' })
}

export const input = (
  <editor>
    <block void>
      <cursor />
      word
    </block>
  </editor>
)

export const output = (
  <editor>
    <block void key>
      <cursor />
      word
    </block>
  </editor>
)
