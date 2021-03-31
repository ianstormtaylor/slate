/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

const fragment = (
  <fragment>
    <block>one</block>
    <block>two</block>
  </fragment>
)
export const run = editor => {
  Transforms.insertFragment(editor, fragment)
}
export const input = (
  <editor>
    <block>
      <anchor />
      word
    </block>
    <block>
      <focus />
      another
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>one</block>
    <block>
      two
      <cursor />
    </block>
    <block>another</block>
  </editor>
)
