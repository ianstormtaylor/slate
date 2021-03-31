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
  return Editor.next(editor, {
    at: [0],
    match: n => Editor.isBlock(editor, n),
  })
}
export const output = [<block>two</block>, [1]]
