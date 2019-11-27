/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }])
}

export const input = (
  <editor>
    <block>
      <anchor />
      <mark key="a">word</mark>
      <focus />
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <anchor />
      word
      <focus />
    </block>
  </editor>
)
