/** @jsx jsx  */

import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <mark key="a">one</mark>
      <mark key="b">two</mark>
    </element>
  </editor>
)

export const test = value => {
  return Array.from(Node.marks(value))
}

export const output = [
  [{ key: 'a' }, 0, <mark key="a">one</mark>, [0, 0]],
  [{ key: 'b' }, 0, <mark key="b">two</mark>, [0, 1]],
]
