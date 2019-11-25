/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, editor.value.selection, [{ key: 'a' }], {
    select: true,
  })
}

export const input = (
  <value>
    <block>
      <anchor />
      word
      <focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">
        <anchor />
        word
        <focus />
      </mark>
    </block>
  </value>
)
