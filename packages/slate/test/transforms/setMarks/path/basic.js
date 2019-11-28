/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Editor.setMarks(editor, [{ existing: true }], { key: true }, { at: [0, 0] })
}

export const input = (
  <editor>
    <block>
      <mark existing>word</mark>
    </block>
  </editor>
)

export const output = (
  <editor>
    <block>
      <mark existing key>
        word
      </mark>
    </block>
  </editor>
)
