/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.move(editor)
}
export const input = (
  <editor>
    <block>
      one
      <cursor />
    </block>
    <block nonSelectable>two</block>
    <block>
      <block nonSelectable>three</block>
      <block>four</block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>one</block>
    <block nonSelectable>two</block>
    <block>
      <block nonSelectable>three</block>
      <block>
        <cursor />
        four
      </block>
    </block>
  </editor>
)
