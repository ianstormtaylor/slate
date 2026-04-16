/** @jsx jsx */
import { Editor } from 'slate'

export const input = (
  <editor>
    <block>one</block>
  </editor>
)
export const test = (editor) => {
  return Editor.point(editor, [0], { edge: 'end' })
}
export const output = { path: [0, 0], offset: 3 }
