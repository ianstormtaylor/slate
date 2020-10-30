/** @jsx jsx  */
import { SlateNode } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = (
  <element>
    <text>one</text>
    <text>two</text>
  </element>
)
export const test = value => {
  return SlateNode.string(value, [1])
}
export const output = `onetwo`
