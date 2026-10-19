/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text>one</text>
    </element>
  </editor>
)
export const test = value => {
  return Node.findPath(value, { text: 'one' })
}
export const output = undefined
