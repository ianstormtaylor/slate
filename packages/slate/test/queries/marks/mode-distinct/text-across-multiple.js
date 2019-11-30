/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <mark key="a">
        <mark key="b">
          <anchor />o
        </mark>
      </mark>
      n
      <mark key="a">
        <mark key="b">
          e<focus />
        </mark>
      </mark>
    </block>
  </editor>
)

export const run = editor => {
  return Array.from(Editor.marks(editor, { mode: 'distinct' }), ([m]) => m)
}

export const output = [{ key: 'b' }, { key: 'a' }]
