/** @jsx jsx  */

import { Element, Node } from 'slate'
import { jsx } from 'slate-hyperscript'

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
  return Node.closest(value, [0, 0, 0], ([e]) => Element.isElement(e))
}

export const output = [
  <element key="b">
    <text />
  </element>,
  [0, 0],
]
