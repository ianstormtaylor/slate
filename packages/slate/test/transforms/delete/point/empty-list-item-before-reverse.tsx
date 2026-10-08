/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block list>
      <block item>one</block>
      <block item>
        <text />
      </block>
    </block>
    <block paragraph>
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block list>
      <block item>one</block>
      <block item>
        <cursor />
      </block>
    </block>
  </editor>
)
