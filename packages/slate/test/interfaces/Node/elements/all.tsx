/** @jsx jsx  */
import { Editor, Node } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <element>
      <text key="a" />
    </element>
    <element>
      <element>
        <text key="b1" />
      </element>
      <element>
        <text key="b2" />
      </element>
    </element>
    <element>
      <text key="c" />
    </element>
  </editor>
)
export const test = value => {
  return Array.from(Node.elements(value))
}
export const output = [
  Editor.node(input, [0]),
  Editor.node(input, [1]),
  Editor.node(input, [1, 0]),
  Editor.node(input, [1, 1]),
  Editor.node(input, [2]),
]
