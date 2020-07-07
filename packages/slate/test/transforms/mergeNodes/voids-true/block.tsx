/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>
      <text>one</text>
      <text>two</text>
    </block>
  </editor>
)
export const run = editor => {
  Transforms.mergeNodes(editor, { at: [0, 1], voids: true })
}
export const output = (
  <editor>
    <block void>onetwo</block>
  </editor>
)
