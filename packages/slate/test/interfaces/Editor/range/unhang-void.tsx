/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const input: Editor = (
  <editor>
    <block>
      one
      <inline void />
      two
    </block>
  </editor>
)

export const inputRange = {
  anchor: { path: [0, 0], offset: 3 },
  focus: { path: [0, 2], offset: 0 },
}

export const test = editor => {
  Transforms.select(editor, inputRange)
  return Editor.unhangRange(editor, editor.selection)
}

export const output = {
  anchor: { path: [0, 0], offset: 3 },
  focus: { path: [0, 2], offset: 0 },
}
