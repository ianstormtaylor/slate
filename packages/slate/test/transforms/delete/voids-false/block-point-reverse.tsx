/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, {
    at: { path: [1, 0], offset: 0 },
    reverse: true,
  })
}
export const input = (
  <editor>
    <block>one</block>
    <block void>
      <text />
    </block>
    <block>
      <cursor />
      two
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>one</block>
    <block>
      <cursor />
      two
    </block>
  </editor>
)
