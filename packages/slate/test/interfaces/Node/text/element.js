/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = (
  <element>
    <text>one</text>
    <text>two</text>
  </element>
)

export const test = value => {
  return Node.text(value, [1])
}

export const output = `onetwo`
