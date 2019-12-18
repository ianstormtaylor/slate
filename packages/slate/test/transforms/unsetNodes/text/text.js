/** @jsx jsx */

import { Editor, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.unsetNodes(editor, 'key', { match: Text.isText })
}

export const input = (
  <editor>
    <block>
      <text key>
        <cursor />
        word
      </text>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
