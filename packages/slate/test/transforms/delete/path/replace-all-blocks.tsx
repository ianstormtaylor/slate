/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  editor.children.map(() => Transforms.delete(editor, { at: [0] }))
  Transforms.insertNodes(editor, <block>new</block>)
}
export const input = (
  <editor>
    <block>one</block>
    <block>two</block>
  </editor>
)
export const output = (
  <editor>
    <block>
      new
      <cursor />
    </block>
  </editor>
)
