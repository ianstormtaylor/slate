/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setMarks(
    editor,
    {
      anchor: { path: [0, 1], offset: 0 },
      focus: { path: [0, 1], offset: 2 },
    },
    [{ key: 'a' }],
    { thing: true }
  )
}

export const input = (
  <value>
    <block>
      w<mark key="a">or</mark>d
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      w
      <mark key="a" thing>
        or
      </mark>
      d
    </block>
  </value>
)
