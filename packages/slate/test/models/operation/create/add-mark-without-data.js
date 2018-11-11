import Operation from '../../../../src/models/operation'

export const input = {
  type: 'add_mark',
  path: [2, 1],
  offset: 3,
  length: 5,
  mark: 'b',
}

export default function(op) {
  return Operation.create(op)
}

export const output = {
  object: 'operation',
  type: 'add_mark',
  path: [2, 1],
  offset: 3,
  length: 5,
  mark: {
    data: {},
    object: 'mark',
    type: 'b',
  },
  data: {},
}
