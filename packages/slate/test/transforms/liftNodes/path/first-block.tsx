/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.liftNodes(editor, { at: [0, 0] })
}
export const input = (
  <editor>
    <block>
      <block>one</block>
      <block>two</block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>one</block>
    <block>
      <block>two</block>
    </block>
  </editor>
)
