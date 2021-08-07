/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'
import { cloneDeep } from 'lodash'

export const input = (
  <editor>
    <element>
      <text />
    </element>
  </editor>
)
export const test = value => {
  return Node.descendant(value, [0])
}
export const output = cloneDeep(input.children[0])
