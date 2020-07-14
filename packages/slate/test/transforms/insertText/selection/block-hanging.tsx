/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.insertText(editor, 'a')
}
export const input = (
  <editor>
    <block>
      <anchor />
      one
    </block>
    <block>
      <focus />
      two
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      a<cursor />
    </block>
    <block>two</block>
  </editor>
)
export const skip = true
