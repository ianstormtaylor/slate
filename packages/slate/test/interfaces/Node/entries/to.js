/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text key="a" />
      <text key="b" />
      <text key="c" />
      <text key="d" />
    </element>
  </value>
)

export const test = value => {
  return Array.from(
    Node.entries(value, {
      from: [0, 1],
      to: [0, 2],
    })
  )
}

export const output = [
  [
    <value>
      <element>
        <text key="a" />
        <text key="b" />
        <text key="c" />
        <text key="d" />
      </element>
    </value>,
    [],
  ],
  [
    <element>
      <text key="a" />
      <text key="b" />
      <text key="c" />
      <text key="d" />
    </element>,
    [0],
  ],
  [<text key="b" />, [0, 1]],
  [<text key="c" />, [0, 2]],
]
