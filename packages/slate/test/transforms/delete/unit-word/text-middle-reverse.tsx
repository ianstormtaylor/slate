/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.delete(editor, { unit: 'word', reverse: true })
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
      one two <cursor />
      ee
    </block>
  </editor>
)
