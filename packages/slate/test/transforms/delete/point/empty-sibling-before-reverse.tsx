/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block heading>
      <text />
    </block>
    <block paragraph>
      <cursor />
      two
    </block>
  </editor>
)
export const output = (
  <editor>
    <block paragraph>
      <cursor />
      two
    </block>
  </editor>
)
