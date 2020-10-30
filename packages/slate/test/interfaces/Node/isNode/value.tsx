import { SlateNode } from 'slate'

export const input = {
  children: [],
  selection: null,
}
export const test = value => {
  return SlateNode.isNode(value)
}
export const output = true
