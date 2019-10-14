import { Operation } from 'slate'

export const input = {
  type: 'insert_node',
  path: [0],
  node: {
    nodes: [],
  },
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
