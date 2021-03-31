/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
    <block>three</block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.nodes(editor, {
      at: [],
      match: () => true,
      mode: 'highest',
    })
  )
}
export const output = [[input, []]]
