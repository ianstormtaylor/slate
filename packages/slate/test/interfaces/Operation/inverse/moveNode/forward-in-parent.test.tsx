import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('inverse-moveNode-forward-in-parent', () => {
  const input = { type: 'move_node', path: [0, 1], newPath: [0, 2] }
  const test = value => {
    return Operation.inverse(value)
  }
  const output = { type: 'move_node', path: [0, 2], newPath: [0, 1] }

  const result = test(input)
  expect(result).toEqual(output)
})
