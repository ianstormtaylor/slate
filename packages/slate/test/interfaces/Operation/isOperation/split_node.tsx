import { Operation } from 'slate'

export const input = {
  type: 'split_node',
  path: [0],
  position: 0,
  properties: {},
}
export const test = value => {
  return Operation.isOperation(value)
}
export const output = true
