/** @jsx jsx  */

import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text key="a" />
      <text key="b" />
    </element>
  </value>
)

export const test = value => {
  return Array.from(Node.texts(value))
}

export const output = [
  [<text key="a" />, [0, 0]],
  [<text key="b" />, [0, 1]],
]
