/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = (editor) => {
  Transforms.deleteContent(editor, { unit: 'character', reverse: true })
}
export const input = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      word
    </block>
  </editor>
)
