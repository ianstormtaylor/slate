import { Operation } from 'slate'

export const input = {
  type: 'set_node',
  path: [0],
  properties: {},
  newProperties: {},
}
export const test = value => {
  return Operation.isOperation(value)
}
export const output = true
