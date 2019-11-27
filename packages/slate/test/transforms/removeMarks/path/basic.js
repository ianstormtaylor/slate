/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [{ key: 'a' }], { at: [0, 0] })
}

export const input = (
  <editor>
    <block>
      <mark key="a">word</mark>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>word</block>
  </editor>
)
