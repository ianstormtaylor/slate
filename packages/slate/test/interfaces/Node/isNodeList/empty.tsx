import { SlateNode } from 'slate'

export const input = []
export const test = value => {
  return SlateNode.isNodeList(value)
}
export const output = true
