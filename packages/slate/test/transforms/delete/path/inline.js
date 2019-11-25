/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <value>
    <block>
      <text />
      <inline>one</inline>
      <text />
    </block>
  </value>
)

export const run = editor => {
  Editor.delete(editor, { at: [0, 1] })
}

export const output = (
  <value>
    <block>
      <text />
    </block>
  </value>
)
