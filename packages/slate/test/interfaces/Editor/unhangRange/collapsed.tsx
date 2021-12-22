/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
export const test = editor => {
  return Editor.unhangRange(editor, editor.selection)
}
export const output = {
  anchor: { path: [0, 0], offset: 3 },
  focus: { path: [0, 0], offset: 3 },
}
