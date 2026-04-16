/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.deselect(editor)
}
export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>one</block>
  </editor>
)
