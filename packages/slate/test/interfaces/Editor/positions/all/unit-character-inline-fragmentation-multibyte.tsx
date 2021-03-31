/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      😀<inline>😀</inline>😀
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(Editor.positions(editor, { at: [], unit: 'character' }))
}

export const output = [
  { path: [0, 0], offset: 0 },
  { path: [0, 0], offset: 2 },
  { path: [0, 1, 0], offset: 2 },
  { path: [0, 2], offset: 2 },
]
