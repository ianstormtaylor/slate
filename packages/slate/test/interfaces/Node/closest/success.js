/** @jsx jsx  */

import { Element, Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element key="a">
      <element key="b">
        <text />
      </element>
    </element>
  </editor>
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
