/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setMarks(
    editor,
    editor.value.selection,
    [{ key: 'a' }],
    { thing: true },
    { select: true }
  )
}

export const input = (
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

export const output = (
  <value>
    <block>
      <mark key="a" thing>
        <anchor />
        word
        <focus />
      </mark>
    </block>
  </value>
)
