/** @jsx jsx */
import { Transforms } from 'slate'
import { jsx } from '../..'
import { cloneDeep } from 'lodash'

export const run = editor => {
  Transforms.delete(editor)
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
export const skip = true // TODO: see https://github.com/ianstormtaylor/slate/pull/4188
export const output = cloneDeep(input)
