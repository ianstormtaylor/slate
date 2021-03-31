/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { unit: 'character', reverse: true })
}
export const input = (
  <editor>
    <block>
      word📛
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      word
      <cursor />
    </block>
  </editor>
)
