import { Node } from 'slate'

export const input = {
  children: [],
}
export const test = value => {
  return Node.isNode(value)
}
export const output = true
