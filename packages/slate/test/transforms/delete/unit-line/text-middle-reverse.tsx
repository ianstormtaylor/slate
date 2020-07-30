/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { unit: 'line', reverse: true })
}
export const input = (
  <editor>
    <block>
      one two thr
      <cursor />
      ee
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <cursor />
      ee
    </block>
  </editor>
)
