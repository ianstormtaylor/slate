/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <text>one</text>
      <block>two</block>
      <text>three</text>
    </fragment>
  )
}
export const input = (
  <editor>
    <block>
      wo
      <cursor />
      rd
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>woone</block>
    <block>two</block>
    <block>
      three
      <cursor />
      rd
    </block>
  </editor>
)
