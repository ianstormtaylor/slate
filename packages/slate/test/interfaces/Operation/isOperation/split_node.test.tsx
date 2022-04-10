import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-split_node', () => {
  const input = {
    type: 'split_node',
    path: [0],
    position: 0,
    properties: {},
  }
  const test = value => {
    return Operation.isOperation(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
