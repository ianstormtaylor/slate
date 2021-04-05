/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>word</block>
  </editor>
)
export const run = editor => {
  Transforms.setNodes(editor, { a: true }, { at: [0, 0], voids: true })
}
export const output = (
  <editor>
    <block void>
      <text a>word</text>
    </block>
  </editor>
)
