import { Node } from 'slate'

export const input = [
  {
    nodes: [],
  },
]

export const test = value => {
  return Node.isNodeList(value)
}

export const output = true
