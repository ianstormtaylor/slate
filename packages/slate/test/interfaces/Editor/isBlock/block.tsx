/** @jsx jsx */
import { Editor, Element } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
  </editor>
)
export const test = editor => {
  const block = editor.children[0]
  return Element.isElement(block) && Editor.isBlock(editor, block)
}
export const output = true
