/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.addMarks(editor, [{ key: 'a' }], { at: [0, 0] })
}

export const input = (
  <value>
    <block>word</block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark key="a">word</mark>
    </block>
  </value>
)
