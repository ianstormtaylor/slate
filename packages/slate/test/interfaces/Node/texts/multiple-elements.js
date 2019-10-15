/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text key="a" />
    </element>
    <element>
      <text key="b" />
    </element>
  </value>
)

export const test = value => {
  return Array.from(Node.texts(value))
}

export const output = [[<text key="a" />, [0, 0]], [<text key="b" />, [1, 0]]]
