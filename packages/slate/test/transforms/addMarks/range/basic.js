/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(
    editor,
    {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 3 },
    },
    [{ key: 'a' }]
  )
}

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const output = (
  <value>
    <block>
      w<mark key="a">or</mark>d
    </block>
  </value>
)
