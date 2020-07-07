/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(
    editor,
    <fragment>
      one
      <inline>two</inline>
      three
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
    <block>
      woone
      <inline>two</inline>
      three
      <cursor />
      rd
    </block>
  </editor>
)
