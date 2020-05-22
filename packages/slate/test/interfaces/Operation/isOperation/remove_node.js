import { Operation, OperationType } from 'slate'

export const input = {
  type: OperationType.RemoveNode,
  path: [0],
  node: {
    children: [],
  },
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
