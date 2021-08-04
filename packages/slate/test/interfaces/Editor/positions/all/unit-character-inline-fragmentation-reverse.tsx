/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      1<inline>2</inline>3
    </block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.positions(editor, { at: [], unit: 'character', reverse: true })
  )
}

export const output = [
  { path: [0, 2], offset: 1 },
  { path: [0, 2], offset: 0 },
  { path: [0, 1, 0], offset: 0 },
  { path: [0, 0], offset: 0 },
]
