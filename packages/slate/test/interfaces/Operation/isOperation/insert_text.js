import { Operation, OperationType } from 'slate'

export const input = {
  type: OperationType.InsertText,
  path: [0],
  offset: 0,
  text: 'string',
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
