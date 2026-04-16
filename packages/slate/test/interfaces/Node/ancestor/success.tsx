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
  return Node.ancestor(value, [0])
}
export const output = cloneDeep(input.children[0])
