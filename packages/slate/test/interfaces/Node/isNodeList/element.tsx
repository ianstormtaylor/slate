import { SlateNode } from 'slate'

export const input = {
  children: [],
}
export const test = value => {
  return SlateNode.isNodeList(value)
}
export const output = false
