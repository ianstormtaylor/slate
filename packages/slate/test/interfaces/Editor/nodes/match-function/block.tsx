/** @jsx jsx */
import { Editor, Element } from 'slate'
import { jsx } from '../../../..'

export const input = (
  <editor>
    <block>one</block>
  </editor>
)
export const test = editor => {
  return Array.from(
    Editor.nodes(editor, {
      at: [],
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
    })
  )
}
export const output = [[<block>one</block>, [0]]]
