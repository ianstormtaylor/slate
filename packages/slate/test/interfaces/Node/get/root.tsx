/** @jsx jsx  */

import { cloneDeep } from 'lodash'
import { Node } from 'slate'

export const input = (
  <editor>
    <element>
      <text />
    </element>
  </editor>
)
export const test = (value) => {
  return Node.get(value, [])
}
export const skip = true // TODO: see https://github.com/ianstormtaylor/slate/pull/4188
export const output = cloneDeep(input)
