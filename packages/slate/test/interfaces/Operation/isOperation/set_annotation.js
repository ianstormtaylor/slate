import { Operation } from 'slate'

export const input = {
  type: 'set_annotation',
  key: 'a',
  properties: {},
  newProperties: {},
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
