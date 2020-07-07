/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text key="a" />
      <text key="b" />
      <text key="c" />
      <text key="d" />
    </element>
  </editor>
)
export const test = value => {
  return Array.from(
    Node.elements(value, {
      range: {
        anchor: {
          path: [0, 1],
          offset: 0,
        },
        focus: {
          path: [0, 2],
          offset: 0,
        },
      },
    })
  )
}
export const output = [
  [
    <element>
      <text key="a" />
      <text key="b" />
      <text key="c" />
      <text key="d" />
    </element>,
    [0],
  ],
]
