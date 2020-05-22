import { Operation, OperationType } from 'slate'

export const input = {
  type: OperationType.SplitNode,
  path: [0],
  position: 0,
  target: 0,
  properties: {},
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
