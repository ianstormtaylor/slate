import { Operation, OperationType } from 'slate'

export const input = {
  type: OperationType.InsertNode,
  path: [0],
  node: {
    children: [],
  },
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
