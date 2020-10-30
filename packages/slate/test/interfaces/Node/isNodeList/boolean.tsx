import { SlateNode } from 'slate'

export const input = true
export const test = value => {
  return SlateNode.isNodeList(value)
}
export const output = false
