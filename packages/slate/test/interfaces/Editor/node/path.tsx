/** @jsx jsx */
import { Editor } from 'slate'

export const input = (
  <editor>
    <block>one</block>
  </editor>
)
export const test = (editor) => {
  return Editor.node(editor, [0])
}
export const output = [<block>one</block>, [0]]
