/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.removeMarks(editor, [0, 0], [{ key: 'a' }])
}

export const input = (
  <value>
    <block>
      <mark key="a">word</mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>word</block>
  </value>
)
