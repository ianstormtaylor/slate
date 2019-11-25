/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(editor, { key: true }, { match: 'block' })
}

export const input = (
  <value>
    <block void>
      <cursor />
      word
    </block>
  </value>
)

export const output = (
  <value>
    <block void key>
      <cursor />
      word
    </block>
  </value>
)
