/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { unit: 'character' })
}
export const input = (
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
export const output = (
  <editor>
    <block>
      one
      <cursor />
      four
    </block>
  </editor>
)
