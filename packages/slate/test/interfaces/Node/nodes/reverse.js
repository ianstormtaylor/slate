/** @jsx jsx  */

import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text key="a" />
      <text key="b" />
    </element>
    <element>
      <text key="c" />
      <text key="d" />
    </element>
  </editor>
)

export const test = value => {
  return Array.from(Node.nodes(value, { reverse: true }))
}

export const output = [
  [input, []],
  [
    <element>
      <text key="c" />
      <text key="d" />
    </element>,
    [1],
  ],
  [<text key="d" />, [1, 1]],
  [<text key="c" />, [1, 0]],
  [
    <element>
      <text key="a" />
      <text key="b" />
    </element>,
    [0],
  ],
  [<text key="b" />, [0, 1]],
  [<text key="a" />, [0, 0]],
]
