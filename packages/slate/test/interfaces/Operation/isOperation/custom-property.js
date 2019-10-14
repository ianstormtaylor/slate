import { Operation } from 'slate'

export const input = {
  type: 'add_mark',
  path: [0],
  mark: {},
  custom: true,
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
