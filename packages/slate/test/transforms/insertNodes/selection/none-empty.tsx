/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = <editor />
export const run = editor => {
  Transforms.insertNodes(editor, <block>one</block>)
}
export const output = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
