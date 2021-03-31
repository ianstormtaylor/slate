/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text key="a" />
    </element>
    <element>
      <text key="b" />
    </element>
  </editor>
)
export const test = value => {
  return Array.from(Node.nodes(value))
}
export const output = [
  [input, []],
  [
    <element>
      <text key="a" />
    </element>,
    [0],
  ],
  [<text key="a" />, [0, 0]],
  [
    <element>
      <text key="b" />
    </element>,
    [1],
  ],
  [<text key="b" />, [1, 0]],
]
