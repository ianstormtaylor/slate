/** @jsx jsx  */

import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

export const input = <text>one</text>

export const test = value => {
  return Node.text(value)
}

export const output = `one`
