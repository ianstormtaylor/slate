/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <mark key="a">one</mark>
      <mark key="b">two</mark>
    </element>
  </value>
)

export const test = value => {
  return Array.from(Node.marks(value, { reverse: true }))
}

export const output = [
  [{ key: 'b' }, 0, <mark key="b">two</mark>, [0, 1]],
  [{ key: 'a' }, 0, <mark key="a">one</mark>, [0, 0]],
]
