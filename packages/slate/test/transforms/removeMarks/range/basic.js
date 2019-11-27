/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }], {
    at: {
      anchor: { path: [0, 1], offset: 0 },
      focus: { path: [0, 1], offset: 2 },
    },
  })
}

export const input = (
  <editor>
    <block>
      w<mark key="a">or</mark>d
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>word</block>
  </editor>
)
