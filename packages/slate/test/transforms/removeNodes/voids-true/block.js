/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>one</block>
  </editor>
)

export const run = editor => {
  Editor.removeNodes(editor, { at: [0, 0], voids: true })
}

export const output = (
  <editor>
    <block void>
      <text />
    </block>
  </editor>
)
