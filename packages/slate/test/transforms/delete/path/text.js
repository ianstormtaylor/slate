/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.delete(editor, { at: [0, 0] })
}

export const input = (
  <editor>
    <block>
      <text>one</text>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <text />
    </block>
  </editor>
)
