/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const test = editor => {
  return Array.from(Editor.positions(editor, { at: [1, 0] }))
}
export const output = [
  { path: [1, 0], offset: 0 },
  { path: [1, 0], offset: 1 },
  { path: [1, 0], offset: 2 },
  { path: [1, 0], offset: 3 },
]
