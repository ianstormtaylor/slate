/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>one</block>
  </editor>
)
export const test = editor => {
  const block = editor.children[0]
  return Editor.isVoid(editor, block)
}
export const output = true
