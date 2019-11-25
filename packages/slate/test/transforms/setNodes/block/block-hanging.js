/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setNodes(editor, { key: true }, { match: 'block' })
}

export const input = (
  <value>
    <block>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </value>
)

export const output = (
  <value>
    <block key>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </value>
)
