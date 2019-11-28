/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }], { at: [0, 0] })
}

export const input = (
  <editor>
    <block>word</block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <mark key="a">word</mark>
    </block>
  </editor>
)
