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
      <block>
        word
        <cursor />
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>wordone</block>
      <block>two</block>
      <block>
        three
        <cursor />
      </block>
    </block>
  </editor>
)
