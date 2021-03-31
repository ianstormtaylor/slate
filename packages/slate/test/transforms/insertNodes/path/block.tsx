/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
export const run = editor => {
  Transforms.insertNodes(
    editor,
    <block>
      <text />
    </block>,
    { at: [0] }
  )
}
export const output = (
  <editor>
    <block>
      <text />
    </block>
    <block>
      <cursor />
      one
    </block>
  </editor>
)
