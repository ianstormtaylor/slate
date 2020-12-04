import { Operation } from 'slate'

export const input = { type: 'move_node', path: [0, 2], newPath: [1, 0, 0] }
export const test = value => {
  return Operation.inverse(value)
}
export const output = { type: 'move_node', path: [1, 0, 0], newPath: [0, 2] }
