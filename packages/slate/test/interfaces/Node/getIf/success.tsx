/** @jsx jsx  */
import { Node } from 'slate'

export const input = (
  <editor>
    <element>
      <text />
    </element>
  </editor>
)
export const test = (value) => {
  return Node.getIf(value, [0])
}
export const output = (
  <element>
    <text />
  </element>
)
