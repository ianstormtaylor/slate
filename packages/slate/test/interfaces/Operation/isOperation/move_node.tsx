import { Operation } from 'slate'

export const input = {
  type: 'move_node',
  path: [0],
  newPath: [1],
}
export const test = value => {
  return Operation.isOperation(value)
}
export const output = true
