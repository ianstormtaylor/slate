/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      one<inline>two</inline>three
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(Editor.positions(editor, { reverse: true, at: [0, 1] }))
}
export const output = [
  { path: [0, 1, 0], offset: 3 },
  { path: [0, 1, 0], offset: 2 },
  { path: [0, 1, 0], offset: 1 },
  { path: [0, 1, 0], offset: 0 },
]
