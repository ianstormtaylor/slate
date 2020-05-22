import { Operation, OperationType } from 'slate'

export const input = {
  type: OperationType.MoveNode,
  path: [0, 2, 1],
  newPath: [0, 1],
}

export const test = value => {
  return Operation.inverse(value)
}

export const output = {
  type: OperationType.MoveNode,
  path: [0, 1],
  newPath: [0, 3, 1],
}
