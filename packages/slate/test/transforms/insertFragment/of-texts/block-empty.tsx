/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor, options = {}) => {
  Transforms.insertFragment(editor, <fragment>fragment</fragment>, options)
}
export const input = (
  <editor>
    <block>
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      fragment
      <cursor />
    </block>
  </editor>
)
