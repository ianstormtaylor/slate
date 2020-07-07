/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../..'

export const run = editor => {
  editor.insertText('t')
  Transforms.move(editor, { reverse: true })
  editor.insertText('w')
  Transforms.move(editor, { reverse: true })
  editor.insertText('o')
}
export const input = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      onew
      <cursor />t
    </block>
  </editor>
)
export const skip = true
