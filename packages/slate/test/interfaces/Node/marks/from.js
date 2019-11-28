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
  return Array.from(Node.marks(value, { from: [0, 1] }))
}

export const output = [[{ key: 'b' }, 0, <mark key="b">two</mark>, [0, 1]]]
