/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      wo
      <anchor />
      <mark key="a">rd</mark>
    </block>
    <block>
      <mark key="a">an</mark>
      <focus />
      other
    </block>
  </value>
)

export const output = (
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
