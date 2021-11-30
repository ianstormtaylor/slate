/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <anchor />
      This is a first paragraph
    </block>
    <block>This is the second paragraph</block>
    <block void>
      <focus />
    </block>
  </editor>
)

export const test = editor => {
  return Editor.unhangRange(editor, editor.selection)
}

export const output = {
  anchor: { path: [0, 0], offset: 0 },
  focus: { path: [0, 0], offset: 25 },
}
