/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { unit: 'character', reverse: true })
}
export const input = (
  <editor>
    <block>
      พี่
      <cursor />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      พี
      <cursor />
    </block>
  </editor>
)
