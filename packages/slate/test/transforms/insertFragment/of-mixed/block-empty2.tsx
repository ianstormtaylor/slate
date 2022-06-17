/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <block>two</block>
      <text>three</text>
    </fragment>
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
    <block>two</block>
    <block>
      <text>
        three
        <cursor />
      </text>
    </block>
  </editor>
)
