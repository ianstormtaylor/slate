/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <text>one</text>
      <block>two</block>
    </fragment>
  )
}
export const input = (
  <editor>
    <block>
      word
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>wordone</block>
    <block>
      two
      <cursor />
    </block>
  </editor>
)
