/** @jsx jsx */
import { Editor } from 'slate'

export const input = (
  <editor>
    <block>one</block>
  </editor>
)
export const test = (editor) => {
  return Array.from(Editor.nodes(editor, { at: [] }))
}
export const output = [
  [input, []],
  [<block>one</block>, [0]],
  [<text>one</text>, [0, 0]],
]
