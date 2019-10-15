import { Node } from 'slate'

export const input = {
  nodes: [],
}

export const test = value => {
  return Node.isNode(value)
}

export const output = true
