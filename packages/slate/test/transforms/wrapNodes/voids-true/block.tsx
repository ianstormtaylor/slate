/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.wrapNodes(editor, <block a />, { at: [0, 0], voids: true })
}
export const input = (
  <editor>
    <block void>word</block>
  </editor>
)
export const output = (
  <editor>
    <block void>
      <block a>word</block>
    </block>
  </editor>
)
