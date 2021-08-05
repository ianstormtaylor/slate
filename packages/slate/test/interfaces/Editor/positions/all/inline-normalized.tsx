/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>
      <text />
      <inline>o</inline>
      <text />
    </block>
  </editor>
)

export const test = editor => {
  return Array.from(
    Editor.positions(editor, {
      at: Editor.range(editor, []),
      unit: 'character',
    })
  )
}

// this is the output but it's incorrect.
// there should be two positions, before the character and after the character
export const output = [
  { path: [0, 0], offset: 0 },
  { path: [0, 1, 0], offset: 1 },
]
