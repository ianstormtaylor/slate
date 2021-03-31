import { Operation } from 'slate'
// This test covers moving a child to the location of where the current parent is (not becoming its parent).
// When the move happens the child is inserted infront of its old parent causing its former parent's index to shiftp
// back within its former grandparent (now parent).
export const input = { type: 'move_node', path: [0, 2, 1], newPath: [0, 2] }
export const test = value => {
  return Operation.inverse(value)
}
export const output = { type: 'move_node', path: [0, 2], newPath: [0, 3, 1] }
