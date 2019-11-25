/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, editor.value.selection, [{ key: 'a' }], {
    select: true,
  })
}

export const input = (
  <value>
    <block>
      <mark key="a">
        wor
        <anchor />d<focus />
      </mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">wor</mark>
      <text>
        <anchor />d<focus />
      </text>
    </block>
  </value>
)
