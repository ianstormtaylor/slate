/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text>one</text>
    </element>
    <element>
      <element>
        <text>two</text>
      </element>
    </element>
  </editor>
)
export const test = value => {
  const target = value.children[1].children[0].children[0]
  return Node.findPath(value, target)
}
export const output = [1, 0, 0]
