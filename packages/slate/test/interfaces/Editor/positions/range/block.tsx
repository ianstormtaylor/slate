/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
    <block>three</block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.positions(editor, {
      at: {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [2, 0], offset: 2 },
      },
    })
  )
}
export const output = [
  { path: [0, 0], offset: 1 },
  { path: [0, 0], offset: 2 },
  { path: [0, 0], offset: 3 },
  { path: [1, 0], offset: 0 },
  { path: [1, 0], offset: 1 },
  { path: [1, 0], offset: 2 },
  { path: [1, 0], offset: 3 },
  { path: [2, 0], offset: 0 },
  { path: [2, 0], offset: 1 },
  { path: [2, 0], offset: 2 },
]
