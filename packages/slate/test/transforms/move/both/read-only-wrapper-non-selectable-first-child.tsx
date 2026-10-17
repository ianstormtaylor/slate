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
    <block readOnly>
      <block nonSelectable>two</block>
      <block>three</block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>one</block>
    <block readOnly>
      <block nonSelectable>two</block>
      <block>
        <cursor />
        three
      </block>
    </block>
  </editor>
)
