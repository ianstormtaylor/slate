/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(editor, { key: true }, { match: 'block' })
}

export const input = (
  <value>
    <block>
      <block>
        <cursor />
        word
      </block>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <block key>
        <cursor />
        word
      </block>
    </block>
  </value>
)
