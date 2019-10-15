import { Node } from 'slate'

export const input = [
  {
    nodes: [],
    selection: null,
    annotations: {},
  },
]

export const test = value => {
  return Node.isNodeList(value)
}

export const output = true
