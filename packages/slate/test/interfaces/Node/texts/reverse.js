/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text key="a" />
      <text key="b" />
    </element>
  </value>
)

export const test = value => {
  return Array.from(Node.texts(value, { reverse: true }))
}

export const output = [[<text key="b" />, [0, 1]], [<text key="a" />, [0, 0]]]
