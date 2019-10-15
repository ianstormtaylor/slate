/** @jsx h  */

import { Node } from 'slate'
import h from 'slate-hyperscript'

export const input = <text>one</text>

export const test = value => {
  return Node.text(value)
}

export const output = `one`
