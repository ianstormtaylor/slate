/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
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
  </editor>
)

export const output = (
  <editor>
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
  </editor>
)
