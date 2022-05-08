/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      one
      <inline void>
        <text />
      </inline>
      two
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.positions(editor, {
      at: {
        anchor: { path: [0, 1, 0], offset: 0 },
        focus: { path: [0, 2], offset: 2 },
      },
      unit: 'character',
    })
  )
}
export const output = [
  { path: [0, 1, 0], offset: 0 },
  { path: [0, 2], offset: 1 },
  { path: [0, 2], offset: 2 },
]
