/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <element>
    <text>a</text>
    <element>
      <text>b</text>
    </element>
  </element>
)
export const test = value => {
  return Node.findPath(value, value.children[1].children[0])
}
export const output = [1, 0]
