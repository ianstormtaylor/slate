import { Operation, OperationType } from 'slate'

export const input = {
  type: OperationType.SetNode,
  path: [0],
  properties: {},
  newProperties: {},
  custom: true,
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
