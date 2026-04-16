/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <block>
        <block>one</block>
      </block>
      <block>two</block>
      <block>three</block>
    </fragment>,
    options
  )
}
export const input = (
  <editor>
    <block>word</block>
    <block>
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>word</block>
    <block>
      <block>one</block>
    </block>
    <block>two</block>
    <block>
      three
      <cursor />
    </block>
  </editor>
)
