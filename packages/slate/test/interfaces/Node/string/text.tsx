/** @jsx jsx  */
import { Node } from 'slate'
import { jsx } from '../../..'

export const input = <text>one</text>
export const test = value => {
  return Node.string(value)
}
export const output = `one`
