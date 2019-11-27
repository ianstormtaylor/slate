/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
    <block>
      w
      <mark key="a">
        <anchor />o
      </mark>
      <focus />
      rd
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      w<anchor />o<focus />
      rd
    </block>
  </editor>
)
