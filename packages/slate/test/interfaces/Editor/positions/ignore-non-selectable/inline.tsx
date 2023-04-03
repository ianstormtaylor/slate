/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      one<inline nonSelectable>two</inline>three
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.positions(editor, { at: [], ignoreNonSelectable: true })
  )
}
export const output = [
  { path: [0, 0], offset: 0 },
  { path: [0, 0], offset: 1 },
  { path: [0, 0], offset: 2 },
  { path: [0, 0], offset: 3 },
  { path: [0, 2], offset: 0 },
  { path: [0, 2], offset: 1 },
  { path: [0, 2], offset: 2 },
  { path: [0, 2], offset: 3 },
  { path: [0, 2], offset: 4 },
  { path: [0, 2], offset: 5 },
]
