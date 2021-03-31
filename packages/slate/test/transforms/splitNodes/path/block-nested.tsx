/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.splitNodes(editor, { at: [0, 1] })
}
export const input = (
  <editor>
    <block>
      <block>one</block>
      <block>two</block>
      <block>three</block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>two</block>
      <block>three</block>
    </block>
  </editor>
)
