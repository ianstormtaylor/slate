/** @jsx jsx */
import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.delete(editor, { unit: 'word' })
}
export const input = (
  <editor>
    <block>
      word
      <cursor />
    </block>
    <block>another</block>
  </editor>
)
export const output = (
  <editor>
    <block>
      word
      <cursor />
      another
    </block>
  </editor>
)
