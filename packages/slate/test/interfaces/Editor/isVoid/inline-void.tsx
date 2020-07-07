/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one<inline void>two</inline>three
    </block>
  </editor>
)
export const test = editor => {
  const inline = editor.children[0].children[1]
  return Editor.isVoid(editor, inline)
}
export const output = true
