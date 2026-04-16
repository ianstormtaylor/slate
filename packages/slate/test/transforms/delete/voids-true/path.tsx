/** @jsx jsx */
import { Transforms } from 'slate'

export const input = (
  <editor>
    <block void>
      <text>one</text>
    </block>
  </editor>
)
export const run = (editor) => {
  Transforms.delete(editor, { at: [0, 0], voids: true })
}
export const output = (
  <editor>
    <block void>
      <text />
    </block>
  </editor>
)
