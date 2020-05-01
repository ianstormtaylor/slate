/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      a<inline>b</inline>
    </block>
  </editor>
)

export const test = editor => {
  return Array.from(Editor.positions(editor, { at: [] }))
}

export const output = [
  { path: [0, 0], offset: 0 },
  { path: [0, 0], offset: 1 },
  { path: [0, 1, 0], offset: 0 },
  { path: [0, 1, 0], offset: 1 },
]
