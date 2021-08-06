/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../../..'
import { cloneDeep } from 'lodash'

export const run = editor => {
  Transforms.delete(editor, { unit: 'line', reverse: true })
}
export const input = (
  <editor>
    <block>
      <cursor />
      one two three
    </block>
  </editor>
)
export const output = cloneDeep(input)
