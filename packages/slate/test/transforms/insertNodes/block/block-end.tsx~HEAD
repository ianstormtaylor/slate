/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      word
      <cursor />
    </block>
  </editor>
)
export const run = editor => {
  Transforms.insertNodes(
    editor,
    <block>
      <text />
    </block>
  )
}
export const output = (
  <editor>
    <block>word</block>
    <block>
      <cursor />
    </block>
  </editor>
)
