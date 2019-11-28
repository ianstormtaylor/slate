/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
    <block>
      <mark key="a">
        wor
        <focus />d<anchor />
      </mark>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <mark key="a">wor</mark>
      <text>
        <focus />d<anchor />
      </text>
    </block>
  </editor>
)
