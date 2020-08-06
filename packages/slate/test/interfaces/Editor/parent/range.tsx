/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const test = editor => {
  return Editor.parent(editor, {
    anchor: { path: [0, 0], offset: 1 },
    focus: { path: [0, 0], offset: 2 },
  })
}
export const output = [<block>one</block>, [0]]
