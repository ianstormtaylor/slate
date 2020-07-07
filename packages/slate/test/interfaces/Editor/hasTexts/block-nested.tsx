/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <block>one</block>
    </block>
  </editor>
)
export const test = editor => {
  const block = editor.children[0]
  return Editor.hasTexts(editor, block)
}
export const output = false
