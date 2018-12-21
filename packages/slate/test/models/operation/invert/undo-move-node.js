import Operation from '../../../../src/models/operation'

export const input = {
  type: 'move_node',
  path: [1],
  newPath: [2],
  inverted: false,
}

export default function(op) {
  return Operation.create(op).invert().isInverted
}

export const output = true
