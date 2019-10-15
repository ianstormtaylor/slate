import { Node } from 'slate'

export const input = [
  {
    text: '',
    marks: [],
  },
]

export const test = value => {
  return Node.isNodeList(value)
}

export const output = true
