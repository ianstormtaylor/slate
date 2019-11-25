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
      wor
      <anchor />d<focus />
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wor
      <mark key="a">
        <anchor />d<focus />
      </mark>
    </block>
  </value>
)
