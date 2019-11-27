/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }], {
    at: {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 3 },
    },
  })
}

export const input = (
  <editor>
    <block>word</block>
  </editor>
)

export const output = (
  <editor>
    <block>
      w<mark key="a">or</mark>d
    </block>
  </editor>
)
