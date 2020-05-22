import { Operation, OperationType } from 'slate'

export const input = {
  type: OperationType.SetSelection,
  properties: {},
  newProperties: {},
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
