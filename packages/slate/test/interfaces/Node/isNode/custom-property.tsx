import { SlateNode } from 'slate'

export const input = {
  children: [],
  custom: true,
}
export const test = value => {
  return SlateNode.isNode(value)
}
export const output = true
