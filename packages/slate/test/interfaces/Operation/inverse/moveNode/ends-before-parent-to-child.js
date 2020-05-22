import { Operation, OperationType } from 'slate'

export const input = {
  type: OperationType.MoveNode,
  path: [0, 1],
  newPath: [0, 2, 1],
}

export const test = value => {
  return Operation.inverse(value)
}

// The path has changed here because the removal of [0, 1] caused [0, 2] to shift forward into its location.
export const output = {
  type: OperationType.MoveNode,
  path: [0, 1, 1],
  newPath: [0, 1],
}
