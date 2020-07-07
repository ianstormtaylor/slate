import { Operation } from 'slate'

export const input = { type: 'move_node', path: [0, 1], newPath: [0, 2] }
export const test = value => {
  return Operation.inverse(value)
}
export const output = { type: 'move_node', path: [0, 2], newPath: [0, 1] }
