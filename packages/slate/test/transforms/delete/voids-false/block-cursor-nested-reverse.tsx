/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block>
      <block>one</block>
    </block>
    <block>
      <block void>
        <cursor />
      </block>
      <block>two</block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>one</block>
    </block>
    <block>
      <block>
        <cursor />
        two
      </block>
    </block>
  </editor>
)
