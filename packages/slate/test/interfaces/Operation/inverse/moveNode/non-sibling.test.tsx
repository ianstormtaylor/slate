import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('inverse-moveNode-non-sibling', () => {
  const input = { type: 'move_node', path: [0, 2], newPath: [1, 0, 0] }
  const test = value => {
    return Operation.inverse(value)
  }
  const output = { type: 'move_node', path: [1, 0, 0], newPath: [0, 2] }

  const result = test(input)
  expect(result).toEqual(output)
})
