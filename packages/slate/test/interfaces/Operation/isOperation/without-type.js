import { Operation } from 'slate'

export const input = {
  path: [0],
  mark: {},
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = false
