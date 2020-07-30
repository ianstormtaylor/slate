import { Node } from 'slate'

export const input = [
  {
    text: '',
  },
]
export const test = value => {
  return Node.isNodeList(value)
}
export const output = true
