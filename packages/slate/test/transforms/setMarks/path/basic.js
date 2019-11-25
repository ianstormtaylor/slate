/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setMarks(editor, [0, 0], [{ existing: true }], { key: true })
}

export const input = (
  <value>
    <block>
      <mark existing>word</mark>
    </block>
  </value>
)

export const output = (
  <value>
    <block>
      <mark existing key>
        word
      </mark>
    </block>
  </value>
)
