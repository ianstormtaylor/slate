import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('inverse-moveNode-child-to-parent', () => {
  // This test covers moving a child to the location of where the current parent is (not becoming its parent).
  // When the move happens the child is inserted infront of its old parent causing its former parent's index to shiftp
  // back within its former grandparent (now parent).
  const input = { type: 'move_node', path: [0, 2, 1], newPath: [0, 2] }
  const test = value => {
    return Operation.inverse(value)
  }
  const output = { type: 'move_node', path: [0, 2], newPath: [0, 3, 1] }

  const result = test(input)
  expect(result).toEqual(output)
})
