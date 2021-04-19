/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      <anchor />
      This is a first paragraph
    </block>
    <block>This is the second paragraph</block>
    <block void>
      <focus />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
    </block>
  </editor>
)
