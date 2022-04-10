import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-move_node', () => {
  const input = {
    type: 'move_node',
    path: [0],
    newPath: [1],
  }
  const test = value => {
    return Operation.isOperation(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
