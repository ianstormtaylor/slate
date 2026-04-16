/** @jsx jsx */
import { Transforms } from 'slate'

export const input = (
  <editor>
    <block>
      one
      <cursor />
    </block>
  </editor>
)
export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    <block void>
      <text>two</text>
    </block>,
    { at: [1], select: true, ...options }
  )
}
export const output = (
  <editor>
    <block>one</block>
    <block void>
      two
      <cursor />
    </block>
  </editor>
)
