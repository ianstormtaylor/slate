/** @jsx jsx */
import { Editor, Transforms } from 'slate'
import { jsx } from '../../..'

export const input: Editor = (
  <editor>
    <block>one</block>
    <block>
      <text />
      <inline>two</inline>
      three
    </block>
  </editor>
)

export const inputRange = {
  anchor: { path: [0, 0], offset: 0 },
  focus: { path: [1, 2], offset: 0 },
}

export const test = editor => {
  Transforms.select(editor, inputRange)
  return Editor.unhangRange(editor, editor.selection)
}

export const output = {
  anchor: { path: [0, 0], offset: 0 },
  focus: { path: [1, 1, 0], offset: 3 },
}
