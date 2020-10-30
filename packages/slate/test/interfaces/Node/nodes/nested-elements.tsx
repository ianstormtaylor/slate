/** @jsx jsx  */
import { SlateNode } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <editor>
    <element>
      <element>
        <text key="a" />
      </element>
    </element>
  </editor>
)
export const test = value => {
  return Array.from(SlateNode.nodes(value))
}
export const output = [
  [input, []],
  [
    <element>
      <element>
        <text key="a" />
      </element>
    </element>,
    [0],
  ],
  [
    <element>
      <text key="a" />
    </element>,
    [0, 0],
  ],
  [<text key="a" />, [0, 0, 0]],
]
