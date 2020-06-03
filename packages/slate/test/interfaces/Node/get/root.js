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
  return Node.get(value, [])
}

export const output = cloneDeep(input)
