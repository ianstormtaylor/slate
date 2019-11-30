/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      o<cursor />
      ne
    </block>
  </editor>
)

export const run = editor => {
  return Array.from(Editor.marks(editor, { mode: 'universal' }), ([m]) => m)
}

export const output = []
