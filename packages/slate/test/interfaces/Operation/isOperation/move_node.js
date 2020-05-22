import { Operation, OperationType } from 'slate'

export const input = {
  type: OperationType.MoveNode,
  path: [0],
  newPath: [1],
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
