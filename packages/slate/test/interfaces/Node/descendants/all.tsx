/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text key="a" />
      <text key="b" />
    </element>
  </editor>
)
export const test = value => {
  return Array.from(Node.descendants(value))
}
export const output = [
  [
    <element>
      <text key="a" />
      <text key="b" />
    </element>,
    [0],
  ],
  [<text key="a" />, [0, 0]],
  [<text key="b" />, [0, 1]],
]
