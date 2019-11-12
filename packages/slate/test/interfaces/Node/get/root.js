/** @jsx jsx  */

import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text />
    </element>
  </value>
)

export const test = value => {
  return Node.get(value, [])
}

export const output = (
  <value>
    <element>
      <text />
    </element>
  </value>
)
