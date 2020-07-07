/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text>word</text>
    </block>
  </editor>
)
export const run = editor => {
  Transforms.insertText(editor, 'x', { at: { path: [0, 0], offset: 4 } })
}
export const output = (
  <editor>
    <block>wordx</block>
  </editor>
)
