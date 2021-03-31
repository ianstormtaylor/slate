/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block>one</block>
    <block>
      <cursor />
      two
      <inline>three</inline>
      four
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      one
      <cursor />
      two
      <inline>three</inline>
      four
    </block>
  </editor>
)
