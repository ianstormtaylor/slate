/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor)
}
export const input = (
  <editor>
    <block>
      <cursor />
    </block>
    <block>
      <block>word</block>
      <block>another</block>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <block>
        <cursor />
        word
      </block>
      <block>another</block>
    </block>
  </editor>
)
