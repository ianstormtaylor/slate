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
      <mark key="b">
        <anchor />
        rd
      </mark>
    </block>
    <block>
      <mark key="b">an</mark>
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
        <mark key="b">
          <anchor />
          rd
        </mark>
      </mark>
    </block>
    <block>
      <mark key="a">
        <mark key="b">an</mark>
      </mark>
      <focus />
      other
    </block>
  </value>
)
