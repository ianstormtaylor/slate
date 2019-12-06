/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text />
      <inline void>one</inline>
      <text />
    </block>
  </editor>
)

export const run = editor => {
  Editor.removeNodes(editor, { at: [0, 1, 0], voids: true })
}

export const output = (
  <editor>
    <block>
      <text />
      <inline void>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
