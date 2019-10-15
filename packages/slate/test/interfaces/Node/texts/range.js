/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element>
      <text key="a" />
      <text key="b" />
      <text key="c" />
      <text key="d" />
    </element>
  </value>
)

export const test = value => {
  return Array.from(
    Node.texts(value, {
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

export const output = [[<text key="b" />, [0, 1]], [<text key="c" />, [0, 2]]]
