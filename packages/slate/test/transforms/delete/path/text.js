/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { at: [0, 0] })
}

export const input = (
  <value>
    <block>
      <text>one</text>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <text />
    </block>
  </value>
)
