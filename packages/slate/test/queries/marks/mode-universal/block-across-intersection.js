/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <mark key="a">
        o<anchor />
        ne
      </mark>
    </block>
    <block>
      <mark key="a">
        <mark key="b">
          t<focus />
          wo
        </mark>
      </mark>
    </block>
  </editor>
)

export const run = editor => {
  return Array.from(Editor.marks(editor, { mode: 'universal' }), ([m]) => m)
}

export const output = [{ key: 'a' }]
