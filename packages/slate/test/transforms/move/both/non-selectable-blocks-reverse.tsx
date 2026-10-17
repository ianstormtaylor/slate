/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.move(editor, { reverse: true })
}
export const input = (
  <editor>
    <block>one</block>
    <block nonSelectable>two</block>
    <block nonSelectable>three</block>
    <block>
      <cursor />
      four
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one
      <cursor />
    </block>
    <block nonSelectable>two</block>
    <block nonSelectable>three</block>
    <block>four</block>
  </editor>
)
