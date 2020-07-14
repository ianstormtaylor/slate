/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>one</block>
  </editor>
)
export const run = editor => {
  Transforms.insertNodes(editor, <block>two</block>)
}
export const output = (
  <editor>
    <block>one</block>
    <block>
      two
      <cursor />
    </block>
  </editor>
)
