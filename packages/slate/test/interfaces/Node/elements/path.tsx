/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

// TODO: this test is nonsensical, seemingly testing an API that doesn't exist
// please put a proper test here, then remove this line
export const skip = true

export const input = (
  <editor>
    <element>
      <text key="a" />
      <text key="b" />
    </element>
  </editor>
)

export const test = value => {
  // return Array.from(Node.elements(value, { path: [0, 1] }))
}
export const output = [
  [
    <element>
      <text key="a" />
      <text key="b" />
    </element>,
    [0],
  ],
]
