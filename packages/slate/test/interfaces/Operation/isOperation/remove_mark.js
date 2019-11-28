import { Operation } from 'slate'

export const input = {
  type: 'remove_mark',
  path: [0],
  mark: {},
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
