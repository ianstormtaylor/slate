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
    <block readOnly>
      <block nonSelectable>two</block>
    </block>
    <block>three</block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one
      <cursor />
      three
    </block>
  </editor>
)
