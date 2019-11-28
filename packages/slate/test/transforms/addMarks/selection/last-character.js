/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
    <block>
      wor
      <anchor />d<focus />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      wor
      <mark key="a">
        <anchor />d<focus />
      </mark>
    </block>
  </editor>
)
