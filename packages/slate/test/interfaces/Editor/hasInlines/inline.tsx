/** @jsx jsx */
import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      one<inline>two</inline>three
    </block>
  </editor>
)
export const test = editor => {
  const block = editor.children[0]
  return Editor.hasInlines(editor, block)
}
export const output = true
