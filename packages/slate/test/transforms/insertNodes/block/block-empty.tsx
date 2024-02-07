/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <cursor />
    </block>
    <block>not empty</block>
  </editor>
)
export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    <block>
      <text />
    </block>,
    options
  )
}
export const output = (
  <editor>
    <block>
      <text />
    </block>
    <block>
      <cursor />
    </block>
    <block>not empty</block>
  </editor>
)
