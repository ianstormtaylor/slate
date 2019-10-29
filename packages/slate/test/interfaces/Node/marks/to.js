/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <mark key="a">one</mark>
      <mark key="b">two</mark>
      <mark key="c">three</mark>
    </element>
  </value>
)

export const test = value => {
  return Array.from(
    Node.marks(value, {
      from: [0, 0],
      to: [0, 1],
    })
  )
}

export const output = [
  [{ key: 'a' }, 0, <mark key="a">one</mark>, [0, 0]],
  [{ key: 'b' }, 0, <mark key="b">two</mark>, [0, 1]],
]
