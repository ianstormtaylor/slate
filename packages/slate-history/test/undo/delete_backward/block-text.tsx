/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../..'
import { cloneDeep } from 'lodash'

export const run = editor => {
  Transforms.delete(editor, { reverse: true })
}
export const input = (
  <editor>
    <block>
      wo
      <cursor />
      rd
    </block>
  </editor>
)
export const output = cloneDeep(input)
