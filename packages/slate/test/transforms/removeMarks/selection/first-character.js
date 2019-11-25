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
      <anchor />
      <mark key="a">w</mark>
      <focus />
      ord
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <anchor />w<focus />
      ord
    </block>
  </value>
)
