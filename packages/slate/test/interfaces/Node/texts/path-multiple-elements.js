/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text key="a" />
      <text key="b" />
    </element>
    <element>
      <text key="c" />
      <text key="d" />
    </element>
  </value>
)

export const test = value => {
  return Array.from(Node.texts(value, { at: [0, 1] }))
}

export const output = [
  [<text key="b" />, [0, 1]],
  [<text key="c" />, [1, 0]],
  [<text key="d" />, [1, 1]],
]
