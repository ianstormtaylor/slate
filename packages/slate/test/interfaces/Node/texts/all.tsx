/** @jsx jsx  */
import { SlateNode } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <text key="a" />
      <text key="b" />
    </element>
  </editor>
)
export const test = value => {
  return Array.from(SlateNode.texts(value))
}
export const output = [
  [<text key="a" />, [0, 0]],
  [<text key="b" />, [0, 1]],
]
