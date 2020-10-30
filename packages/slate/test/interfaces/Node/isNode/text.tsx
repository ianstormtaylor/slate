import { SlateNode } from 'slate'

export const input = {
  text: '',
}
export const test = value => {
  return SlateNode.isNode(value)
}
export const output = true
