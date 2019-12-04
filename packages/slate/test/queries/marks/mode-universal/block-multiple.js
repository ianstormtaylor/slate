/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <mark key="a">
        <mark key="b">
          o<cursor />
          ne
        </mark>
      </mark>
    </block>
  </editor>
)

export const run = editor => {
  return Array.from(Editor.marks(editor, { mode: 'universal' }), ([m]) => m)
}

export const output = [{ key: 'b' }, { key: 'a' }]
