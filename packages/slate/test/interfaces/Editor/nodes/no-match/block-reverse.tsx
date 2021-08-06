/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const test = editor => {
  return Array.from(Editor.nodes(editor, { at: [], reverse: true }))
}
export const output = [
  [input, []],
  [<block>two</block>, [1]],
  [<text>two</text>, [1, 0]],
  [<block>one</block>, [0]],
  [<text>one</text>, [0, 0]],
]
