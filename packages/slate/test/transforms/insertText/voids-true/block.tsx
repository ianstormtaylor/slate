/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block void>word</block>
  </editor>
)
export const run = editor => {
  Transforms.insertText(editor, 'x', { at: [0], voids: true })
}
export const output = (
  <editor>
    <block void>x</block>
  </editor>
)
