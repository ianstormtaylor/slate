/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(Editor.positions(editor, { at: [] }))
}
export const output = [
  { path: [0, 0, 0], offset: 0 },
  { path: [0, 0, 0], offset: 1 },
  { path: [0, 0, 0], offset: 2 },
  { path: [0, 0, 0], offset: 3 },
  { path: [1, 0, 0], offset: 0 },
  { path: [1, 0, 0], offset: 1 },
  { path: [1, 0, 0], offset: 2 },
  { path: [1, 0, 0], offset: 3 },
]
