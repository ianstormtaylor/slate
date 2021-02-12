/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      <text />
      <inline>
        <text />
        <inline>
          <text />
        </inline>
        <text />
      </inline>
      <text />
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(Editor.positions(editor, { at: [] }))
}
export const output = [
  { path: [0, 0], offset: 0 },
  { path: [0, 1, 0], offset: 0 },
  { path: [0, 1, 1, 0], offset: 0 },
  { path: [0, 1, 2], offset: 0 },
  { path: [0, 2], offset: 0 },
]
