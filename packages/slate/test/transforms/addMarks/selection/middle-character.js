/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
    <block>
      w<anchor />o<focus />
      rd
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      w
      <mark key="a">
        <anchor />o<focus />
      </mark>
      rd
    </block>
  </editor>
)
