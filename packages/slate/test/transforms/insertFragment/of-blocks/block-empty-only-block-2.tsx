/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(
    editor,
    <fragment>
      <block b>one</block>
      <block b>two</block>
    </fragment>,
    options
  )
}
export const input = (
  <editor>
    <block a>
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block b>one</block>
    <block b>
      two
      <cursor />
    </block>
  </editor>
)
