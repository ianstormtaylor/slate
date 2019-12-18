/** @jsx jsx */

import { Editor, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(editor, { key: true }, { match: Text.isText })
}

export const input = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text key>
        <cursor />
        word
      </text>
    </block>
  </editor>
)
