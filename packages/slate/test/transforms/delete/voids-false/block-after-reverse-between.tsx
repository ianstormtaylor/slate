/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block>one</block>
    <block void>
      <text />
    </block>
    <block>
      <cursor />
    </block>
    <block>two</block>
  </editor>
)
export const output = (
  <editor>
    <block>one</block>
    <block void>
      <cursor />
    </block>
    <block>two</block>
  </editor>
)
