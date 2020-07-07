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
  return Array.from(Node.texts(value))
}
export const output = [
  [<text key="a" />, [0, 0]],
  [<text key="b" />, [1, 0]],
]
