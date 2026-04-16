/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { unit: 'character' })
}
export const input = (
  <editor>
    <block>
      wor
      <cursor />d
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      wor
      <cursor />
    </block>
  </editor>
)
