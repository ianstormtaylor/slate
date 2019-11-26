/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <mark key="a">
        wor
        <focus />d<anchor />
      </mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">wor</mark>
      <text>
        <focus />d<anchor />
      </text>
    </block>
  </value>
)
