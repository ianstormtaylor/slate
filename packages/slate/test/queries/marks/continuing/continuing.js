/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <mark key="a">one</mark>
      <text>
        <cursor />
        two
      </text>
    </block>
    <block />
  </editor>
)

export const run = editor => {
  return Array.from(Editor.marks(editor, { continuing: true }), ([m]) => m)
}

export const output = [{ key: 'a' }]
