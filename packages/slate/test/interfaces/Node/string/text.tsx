/** @jsx jsx  */
import { SlateNode } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = <text>one</text>
export const test = value => {
  return SlateNode.string(value)
}
export const output = `one`
