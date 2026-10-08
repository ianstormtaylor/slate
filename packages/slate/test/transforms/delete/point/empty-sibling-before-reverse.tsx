/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block type="heading">
      <text />
    </block>
    <block type="paragraph">
      <cursor />
      two
    </block>
  </editor>
)
export const output = (
  <editor>
    <block type="paragraph">
      <cursor />
      two
    </block>
  </editor>
)
