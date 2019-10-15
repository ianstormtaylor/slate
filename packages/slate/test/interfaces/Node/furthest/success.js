/** @jsx h  */

import { Element, Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <value>
    <element key="a">
      <element key="b">
        <text />
      </element>
    </element>
  </value>
)

export const test = value => {
  return Node.furthest(value, [0, 0, 0], ([e]) => Element.isElement(e))
}

export const output = [
  <element key="a">
    <element key="b">
      <text />
    </element>
  </element>,
  [0],
]
