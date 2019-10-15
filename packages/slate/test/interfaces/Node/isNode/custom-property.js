import { Node } from 'slate'

export const input = {
  nodes: [],
  custom: true,
}

export const test = value => {
  return Node.isNode(value)
}

export const output = true
