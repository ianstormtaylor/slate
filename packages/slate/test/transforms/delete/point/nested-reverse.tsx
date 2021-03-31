/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block>
      <block>word</block>
      <block>
        <cursor />
        another
      </block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>
        word
        <cursor />
        another
      </block>
    </block>
  </editor>
)
