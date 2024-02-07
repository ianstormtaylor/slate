/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

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
    options
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
