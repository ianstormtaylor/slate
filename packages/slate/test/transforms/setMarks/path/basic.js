/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setMarks(editor, [{ existing: true }], { key: true }, { at: [0, 0] })
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
