/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
    <block>
      <anchor />w<focus />
      ord
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <mark key="a">
        <anchor />w<focus />
      </mark>
      ord
    </block>
  </editor>
)
