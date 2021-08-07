import { Node } from 'slate'

export const input = [
  {
    children: [],
    selection: null,
  },
  'a string',
]
export const test = value => {
  return Node.isNodeList(value)
}
export const output = false
