/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <block>one</block>
      <block>two</block>
      <block>three</block>
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
