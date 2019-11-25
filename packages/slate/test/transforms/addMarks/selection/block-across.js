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
      wo
      <anchor />
      rd
    </block>
    <block>
      an
      <focus />
      other
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      wo
      <mark key="a">
        <anchor />
        rd
      </mark>
    </block>
    <block>
      <mark key="a">
        an
        <focus />
      </mark>
      other
    </block>
  </value>
)
