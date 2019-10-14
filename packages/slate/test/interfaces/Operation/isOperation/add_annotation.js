import { Operation } from 'slate'

export const input = {
  type: 'add_annotation',
  key: 'a',
  annotation: {
    anchor: {
      path: [0],
      offset: 0,
    },
    focus: {
      path: [0],
      offset: 0,
    },
  },
}

export const test = value => {
  return Operation.isOperation(value)
}

export const output = true
